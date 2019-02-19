var app = angular.module('app', ['dynform']);
var newForm = true;
var inDevice = true;
var prices = {};
var selectedProducts = "''";
var query = {
    customers: "select distinct customer_classification, credit_term_description, customer_address, customer_code, customer_name, sales_agent_code, sales_agent_name, ship_to_address ship_to, userid from doctor_expense",
    products: "select distinct principal from itinerary_activities"
}
app.controller('AppCtrl', function ($scope) {
    $scope.eForm = {
        "filename": "oxford_eform_sales_order_form_test3",
        "title": "DO NOT USE THIS. FOR TESTING PURPOSES ONLY.",
        "logo": "assets/img/logo.png",
        "version": "v.11.4",
        "location_href": "http://save-data/eform_sales_order"
    };
    $("#vwTable").hide();
    $scope.stdFormData = {
        obj_date: transformDate(),
        obj_terms: 'DEFAULT TERM',
        obj_order_num2: '0',
        obj_grand_total_2: 0
    };
    $scope.inDevice = inDevice = (navigator.platform.indexOf("iPad") !== -1);
    $scope.customers = {};
    $scope.principals = [];
    $scope.shipToAddress = [];
    $scope.productDescriptions = {};

    $scope.orderSource = [
        'SALESMAN',
        'PRINCIPAL'
    ];

    $scope.rowIndex = 6;
    $('div').css('pointer-events', 'none');
    setTimeout(function () {
        if (newForm) {
            execute("inapp://do-sql/;" + query.customers);
            execute("inapp://do-sql/;" + query.products);
        }
    }, 2500);

    //-----------
    var DB_PRICE = {};
    for (var i in db_price) {
        var row = db_price[i];

        var item_code = row.item_code.trim();
        var customer_classification = (row.customer_classification || 'ANY').trim();
        var customer_name = (row.customer_name || 'ANY').trim().replace(/['"]/g, '`');

        if (!DB_PRICE[item_code]) {
            DB_PRICE[item_code] = {};
        }
        if (!DB_PRICE[item_code][customer_classification]) {
            DB_PRICE[item_code][customer_classification] = {};
        }
        if (!DB_PRICE[item_code][customer_classification][customer_name]) {
            DB_PRICE[item_code][customer_classification][customer_name] = {};
        }
        DB_PRICE[item_code][customer_classification][customer_name] = row.disc_trade_price;
    }

    var DB_FREE = {};
    for (var i in db_free) {
        var row = db_free[i];
        var item_code = row.item_code.trim();
        var customer_classification = (row.customer_classification || 'ANY').trim();
        var customer_name = (row.customer_name || 'ANY').trim().replace(/['"]/g, '`');

        if (!DB_FREE[item_code]) {
            DB_FREE[item_code] = {};
        }
        if (!DB_FREE[item_code][customer_classification]) {
            DB_FREE[item_code][customer_classification] = {};
        }

        DB_FREE[item_code][customer_classification][customer_name] = {
            divisor: row.divisor,
            free_quantity: row.free_quantity
        }
    }
    //-----------

    $scope.initForm = function () {
        if (newForm === true) {
            $('div').css('pointer-events', 'auto');
            $scope.changeToSelect();

            var input = document.getElementById('obj_customer_name');
            var awesomplete = new Awesomplete(input, {
                minChars: 1,
                autoFirst: true,
                sort: Awesomplete.sort
            });

            awesomplete.list = Object.keys($scope.customers).sort();

            document.querySelector('#obj_customer_name').addEventListener('awesomplete-close', function () {
                var k = this.value;
                formOrderNumber();
                $scope.nameEvent(k);
            });

            document.querySelector('#obj_customer_name').addEventListener('awesomplete-selectcomplete', function () {
                var k = this.value;
                formOrderNumber();
                $scope.nameEvent(k);
            });
        }

        $('input, textarea').keyup(function () {
            formOrderNumber()
        });
        $('select').change(function () {
            formOrderNumber()
        });
    };

    $scope.nameEvent = function (k) {
        $scope.$apply(function () {
            $scope.shipToAddress = [];
            var c = {
                customer_address: '',
                customer_code: 'NEW CUSTOMER',
                ship_to_address: [],
                credit_term_description: 'DEFAULT TERM',
                customer_classification: 'ANY',
            }

            if ($scope.customers[k]) {
                c = $scope.customers[k];
                if (c.customer_classification) {
                    if (c.customer_classification.trim() === '') {
                        c.customer_classification = 'ANY';
                    }
                }

                $("#shipSelect").empty();
                var extra = 'selected ';
                for (var i in c.ship_to_address) {
                    var rx = c.ship_to_address[i];
                    $("#shipSelect").append('<option ' + extra + 'value="' + rx + '">' + rx + '</option>');
                    extra = '';
                }
                $scope.shipToAddress = c.ship_to_address;
            }

            console.log(c);
            $scope.stdFormData.obj_customer_name = k;
            $scope.stdFormData.obj_customer_code = c.customer_code;
            $scope.stdFormData.obj_address = c.customer_address;
            $scope.stdFormData.obj_ship = c.ship_to_address[0] || '';
            $scope.stdFormData.obj_terms = c.credit_term_description;

            for (var i = 1; i <= 20; i++) {
                if ($scope.stdFormData['obj_product_code_' + i]) {
                    setSpecialPrice(i);
                    $scope.setFreeQTY2(i);
                }
            }

            $scope.calculateTotal(1);
        })
    }

    $scope.changeToSelect = function () {
        $(".data-form").hide();
        $(".new-form").show();
    }

    $scope.resetForm = function () {
        var ae_name = $scope.stdFormData.obj_ae_name;
        var ae_code = $scope.stdFormData.obj_ae_code;
        var userid = $scope.stdFormData.userid;
        $scope.stdFormData = {
            obj_date: transformDate(),
            obj_terms: 'DEFAULT TERM',
            obj_order_num2: '0',
            obj_grand_total_2: 0,
            obj_ae_name: ae_name,
            obj_ae_code: ae_code,
            userid: userid,
        };
    };

    $scope.validateFirst = function () {
        var reqFields = [
            'obj_customer_name', 'obj_address', 'obj_terms', 'obj_order_source', 'obj_principal_1', 'obj_product_description_1', 'obj_regular_1'
        ];
        return $common.validateFields(reqFields);
    };

    $scope.submitForm = function (finalData) {
        var dateTime = $common.getDateTime();
        var timeStamp = new Date(dateTime).getTime();
        finalData.local_dateTimeCreated = dateTime;
        finalData.local_timeStampCreated = timeStamp;
        finalData.version = $scope.eForm.version;
        finalData.obj_parse_description = finalData.obj_customer_name;
        finalData.obj_parse_preview = finalData.obj_order_num + ' | ' + finalData.obj_date;

        for (var i in finalData) {
            if (i.indexOf('undefined') != -1) {
                delete finalData[i];
            }
        }

        if ($scope.validateFirst()) {
            var result = $common.getResults(finalData);
            console.log(finalData);
            $("textarea#obj_result").val(result);
            alert("Data has been successfully submitted!");

            if ($scope.inDevice) {
                location.href = $scope.eForm.location_href;
            }
            view_mode();
        }
    };

    $scope.addRow = function () {
        if ($scope.rowIndex < 21) {
            var i = $scope.rowIndex;
            $scope.deleteRowData(i);

            $('tr#row' + i).show();
            $scope.calculateTotal();
            formOrderNumber()
            $scope.rowIndex++;
        }
    }

    $scope.deleteRow = function () {
        if ($scope.rowIndex > 6) {
            $scope.rowIndex--;
            var i = $scope.rowIndex;
            $scope.deleteRowData(i);

            $('tr#row' + i).hide();
            $scope.calculateTotal();
            formOrderNumber()
        }
    }

    $scope.deleteRowData = function (i, skip) {
        if (!skip) {
            delete $scope.stdFormData['obj_principal_' + i];
        }
        delete $scope.stdFormData['obj_product_description_' + i];
        delete $scope.stdFormData['obj_product_code_' + i];
        delete $scope.stdFormData['obj_regular_' + i];
        delete $scope.stdFormData['obj_free_' + i];
        delete $scope.stdFormData['obj_price_' + i];
        delete $scope.stdFormData['obj_special_price_' + i];
        delete $scope.stdFormData['obj_discount_' + i];
        delete $scope.stdFormData['obj_sum_' + i];
        delete $scope.stdFormData['obj_sum_' + i + '_1'];
    }

    $scope.populateProducts = function (i) {
        $scope.deleteRowData(i, true);
        $scope.calculateTotal(i);
        setSpecialPrice(i);
        setTimeout(function () {
            execute("inapp://do-sql/;select distinct product as product_description_" + i + ", product_code, price from itinerary_activities where principal='" + $scope.stdFormData['obj_principal_' + i] + "' and product not in (" + getSelectedProducts() + ")order by product");
        }, 250);
    }

    $scope.setProductDetails = function (i) {
        delete $scope.stdFormData['obj_regular_' + i];
        delete $scope.stdFormData['obj_free_' + i];
        delete $scope.stdFormData['obj_special_price_' + i];
        delete $scope.stdFormData['obj_discount_' + i];
        delete $scope.stdFormData['obj_sum_' + i];
        delete $scope.stdFormData['obj_sum_' + i + '_1'];

        var d = $scope.stdFormData['obj_product_description_' + i]
        var item_code = prices[i][d].product_code;

        $scope.stdFormData['obj_product_code_' + i] = item_code;
        $scope.stdFormData['obj_price_' + i] = parseFloat(prices[i][d].price || 0);
        setSpecialPrice(i);
        $scope.calculateTotal(i);
    }

    function setSpecialPrice(i) {
        var item_code = $scope.stdFormData['obj_product_code_' + i];
        var customer_name = $scope.stdFormData['obj_customer_name'];
        var c = $scope.customers[customer_name];
        var customer_classification = 'ANY';
        if (c) {
            if (c.customer_classification) {
                if (c.customer_classification.trim() !== "") {
                    customer_classification = c.customer_classification;
                }
            }
        }
        $scope.stdFormData['obj_special_price_' + i] = null;
        $scope.stdFormData['obj_free_' + i] = null;

        if (DB_PRICE[item_code]) {
            if (DB_PRICE[item_code][customer_classification]) {
                if (!DB_PRICE[item_code][customer_classification][customer_name]) {
                    customer_name = 'ANY'
                }
                $scope.stdFormData['obj_special_price_' + i] = DB_PRICE[item_code][customer_classification][customer_name];
            }
        }
    }

    $scope.setFreeQTY = function (i) {
        $scope.setFreeQTY2(i);
        $scope.calculateTotal(i);
    }

    $scope.setFreeQTY2 = function (i) {
        $('#obj_free_' + i).val('');
        var item_code = $scope.stdFormData['obj_product_code_' + i];
        var customer_name = $scope.stdFormData['obj_customer_name'];
        var c = $scope.customers[customer_name];
        var customer_classification = 'ANY';
        if (c) {
            if (c.customer_classification) {
                if ((c.customer_classification).trim() !== "") {
                    customer_classification = c.customer_classification;
                }
            }
        }
        console.log(customer_classification)
        if (DB_FREE[item_code]) {
            if (DB_FREE[item_code][customer_classification]) {
                __apply(customer_classification);
            } else {
                if (DB_FREE[item_code]['ANY']) {
                    __apply('ANY');
                }
            }

            function __apply(customer_classification) {
                if (!DB_FREE[item_code][customer_classification][customer_name]) {
                    customer_name = 'ANY'
                }
                console.log(item_code, customer_classification, customer_name)
                var free_qty = DB_FREE[item_code][customer_classification][customer_name];
                var regular_qty = $scope.stdFormData['obj_regular_' + i];
                var divisor = free_qty.divisor;
                var free_quantity = free_qty.free_quantity;

                if (regular_qty && regular_qty >= divisor) {
                    var mfq = (regular_qty - (regular_qty % divisor)) / divisor;
                    $('#obj_free_' + i).val(mfq * free_quantity);
                    $scope.stdFormData['obj_free_' + i] = mfq * free_quantity;
                }
            }
        }
    }

    $scope.calculateTotal = function (i) {
        var qty = $scope.stdFormData['obj_regular_' + i];
        var price = $scope.stdFormData['obj_price_' + i];
        var discount = $scope.stdFormData['obj_discount_' + i] || 0;
        if ($scope.stdFormData['obj_special_price_' + i]) {
            price = $scope.stdFormData['obj_special_price_' + i];
        }

        var total = (price - (price * (discount / 100))) * qty;
        $scope.stdFormData['obj_sum_' + i] = total;
        $scope.stdFormData['obj_sum_' + i + '_1'] = total;

        $scope.stdFormData.obj_grand_total_2 = 0;
        for (var x = 1; x <= 20; x++) {
            $scope.stdFormData.obj_grand_total_2 += $scope.stdFormData['obj_sum_' + x] || 0;
        }
        $scope.stdFormData.obj_grand_total = $scope.stdFormData.obj_grand_total_2
    }
});