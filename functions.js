function positionAllCanvas() {
    $common.console('debug', "ready!");
}

function view_mode() {
    $(".data-form").show();
    $(".new-form").hide();
    $("button").remove();
    $("input").attr("readonly", true);
    $("select").prop("disabled", true);
    $('textarea').attr('readonly', 'readonly');

    $('input').each(function () {
        var id = $(this).attr('id');
        var val = $(this).val();
        var view_id = id.replace('obj_', 'vw_');
        if (val !== "") {
            $('#' + view_id).html(val);
        }
    });

    for (var i = 6; i <= 20; i++) {
        var v = $('#obj_principal_' + i).val();
        if (v !== "") {
            $("#view_row"+i).show();
        }
    }

    $("#vwTable").show();
    $("#rowTable").hide();
}

function execute(url) {
    if (inDevice) {
        var iframe = document.createElement("IFRAME");
        iframe.setAttribute("src", url);
        document.documentElement.appendChild(iframe);
        iframe.parentNode.removeChild(iframe);
        iframe = null;
    } else {
        var sql = url.replace('inapp://do-sql/;', '');
        doSQLLiveServer(sql);
    }
}

function doSQLLiveServer(sql) {
    var sql2 = sql;
    sql2 = sql2.replace('from ', 'from vw2_');
    if (sql2.indexOf('where') == -1 && sql2.indexOf('order by') == -1) {
        sql2 += " where userid='rr143'";
    } else {
        sql2 = sql2.replace(' where ', " where userid='rr143' and ");
    }
    if (sql2.indexOf(" product not in ()") != -1) {
        sql2 = sql2.replace(" product not in ()", " product not in ('')");
    }

    $.get('http://oxford.doccsonline.com/api/dosql.php?sql=' + sql2, function (obj) {
        sqlCallBack(sql, obj);
    });

}

function sqlCallBack(sql, obj) {
    var json_str = JSON.parse(obj);
    $scope = angular.element(document).scope();

    if (sql === query.customers) {
        $scope.customers = [];
        for (var i in json_str) {
            var row = json_str[i];
            if (row.customer_name.indexOf('(BLOCKED)') === -1 && row.customer_name.indexOf('(INACTIVE)') === -1) {
                if (!$scope.customers[row.customer_name]) {
                    $scope.customers[row.customer_name] = row;
                    $scope.customers[row.customer_name].ship_to_address = [];
                    if (row.ship_to) {
                        if (row.ship_to.trim() !== '') {
                            $scope.customers[row.customer_name].ship_to_address.push(row.ship_to);
                        }
                    }
                } else {
                    if (row.ship_to) {
                        if (row.ship_to.trim() !== '') {
                            if ($scope.customers[row.customer_name].ship_to_address.indexOf(row.ship_to) === -1) {
                                $scope.customers[row.customer_name].ship_to_address.push(row.ship_to);
                            }
                        }
                    }
                    if (row.credit_term_description) {
                        if (row.credit_term_description.trim() !== '') {
                            $scope.customers[row.customer_name].credit_term_description = row.credit_term_description;
                        }
                    }
                }
                delete $scope.customers[row.customer_name].ship_to;
                if (row.credit_term_description) {
                    if (row.credit_term_description.trim() === '') {
                        row.credit_term_description = "DEFAULT TERM";
                    }
                }
                if (row.sales_agent_name) {
                    if (row.sales_agent_name.trim() !== '') {
                        $scope.stdFormData.obj_ae_name = row.sales_agent_name.toUpperCase();
                        $('#obj_ae_name').val(row.sales_agent_name.toUpperCase());
                    }
                }
                if (row.sales_agent_code) {
                    if (row.sales_agent_code.trim() !== '') {
                        $scope.stdFormData.obj_ae_code = row.sales_agent_code;
                    }
                }

                if (row.userid) {
                    if (row.userid.trim() !== '') {
                        $scope.stdFormData.userid = row.userid;
                    }
                }
            }
        }

        $scope.initForm();
    }

    if (sql === query.products) {
        $scope.principals = json_str;
    }

    if (sql.indexOf('product_description_') !== -1) {
        if (!$scope.productDescriptions2) {
            $scope.productDescriptions2 = {};
        }
        var i = sql.split('product_description_')[1].split(',')[0];
        prices[i] = {};
        $scope.productDescriptions2[i] = [];
        for (var r in json_str) {
            var row = json_str[r];
            prices[i][row['product_description_' + i]] = row;
        }
        // $scope.$apply(function () {
        $scope.productDescriptions2[i] = Object.keys(prices[i]).sort();
        // })
    }
}

function didFinishReloadingData() {
    newForm = false;
    for (var i = 1; i <= 20; i++) {
        var v = $('#obj_principal_' + i).val();
        if (v === '0' || (v.indexOf('undefined') !== -1)) {
            $('#obj_principal_' + i).val('')
            $('#obj_sum_' + i + '_1').val('')
        }

        if ($('#obj_principal_' + i).val()) {
            if (i > 5) {
                $('tr#row' + i).show();
            }
        } else {
            $('#obj_sum_' + i + '_1').val('')
        }
    }
    for (var i = 1; i <= 20; i++) {
        formatMoney('#obj_price_' + i);
        //formatMoney('#obj_special_price_' + i);
        formatMoney('#obj_sum_' + i + '_1');
    }
    formatMoney('#obj_grand_total_2')
    view_mode();
}


function formOrderNumber() {
    $scope = angular.element(document).scope();
    var eData = $scope.stdFormData;
    var custName = eData.obj_customer_name;
    var str = custName + " " + eData.obj_date + " " + eData.obj_grand_total;
    for (var i = 1; i <= 20; i++) {
        if (eData['obj_product_code_' + i]) {
            str += eData['obj_product_code_' + i];
        }
    }
    if (custName) {
        var encrypt = codeFromString(str).replace(/-/g, '');
        $("#obj_order_num").val(eData.obj_ae_code + '-' + encrypt);
        $scope.stdFormData.obj_order_num = eData.obj_ae_code + '-' + encrypt;
    } else {
        $("#obj_order_num").val(eData.obj_ae_code + '-');
        $scope.stdFormData.obj_order_num = eData.obj_ae_code + '-';
    }
}

function formatMoney(id) {
    var numm = $(id).val();
    if (numm.trim() !== '') {
        numm = numm.toString().replace(/,/g, '');
        numm = parseFloat(numm).toFixed(2);
        var components = numm.split(".");
        components[0] = components[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        var v = components.join(".");
        $(id).val(v);
    }
}

function showMessage(message) {
    $("#alertdiv").show();
    $("#alertmessage").html(message);
}

function getSelectedProducts() {
    var selectedProducts = "";
    var xproducts = [];
    $("[id^='obj_product_description']").each(function () {
        var _id = $(this).attr("id");
        var product = $("#" + _id).val();
        if (product != '') {
            xproducts.push(product);
        }
        if (xproducts.length > 0) {
            selectedProducts = "'" + xproducts.join("', '") + "'";
        } else {
            selectedProducts = "''";
        }
    });
    return selectedProducts;
}

function hashCode(str) {
    if (str) {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    } else {
        return 0;
    }
}

function hashCode8(str) {
    if (str) {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 7) - hash);
        }
        return hash;
    } else {
        return 0;
    }
}

function intToRGB(i) {
    var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
}

function colorFromString(str) {
    switch (str) {
        case "Reached":
            return 'gold'
        case "Unreached":
            return 'darkred'
        case "Called To Target":
            return 'green'

        default:
            return '#' + intToRGB(hashCode(str));
    }
}

function intToCode(i) {
    var c = (i & 0xFFFFFFFF)
        .toString(16)
        .toUpperCase();

    return "0000000".substring(0, 8 - c.length) + c;
}

function codeFromString(str) {
    return intToCode(hashCode8(str));
}

function transformDate() {
    var d = new Date();
    var y = d.getFullYear();
    var m = ('0' + (d.getMonth() + 1)).slice(-2);
    var d = ('0' + d.getDate()).slice(-2);
    return y + '/' + m + '/' + d;
}

function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode == 46) {
        console.log(evt.value);
    }
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46)
        return false;
    return true;
}

