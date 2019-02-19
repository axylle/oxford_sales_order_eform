app.directive('trRow', function () {
    var template = "";
    for (var i = 1; i <= 20; i++) {
        if (i <= 5) {
            template += '<tr>';
        } else {
            template += '<tr style="display:none" id="row' + i + '">';
        }
        template += '<td>';
        template += '<input type="text" class="data-form" id="obj_principal_' + i + '" ng-model="stdFormData.obj_principal_' + i + '" caption="PRODUCT CODE">';
        // template += '<textarea class="data-form" id="obj_principal_' + i + '" ng-model="stdFormData.obj_principal_' + i + '" caption="PRODUCT CODE"></textarea>';
        template += '<select ng-model="stdFormData.obj_principal_' + i + '" class="new-form" ng-change="populateProducts(' + i + ')">';
        template += '<option value="" selected>---</option>';
        template += '<option ng-repeat="p in principals" value="{{p.principal}}">{{p.principal}}</option>';
        template += '</select>';
        template += '</td>';
        template += '<td>';
        template += '<input type="text" class="data-form" id="obj_product_description_' + i + '" ng-model="stdFormData.obj_product_description_' + i + '" caption="PRODUCT DESCRIPTION">';
        // template += '<textarea class="data-form" id="obj_product_description_' + i + '" ng-model="stdFormData.obj_product_description_' + i + '" caption="PRODUCT DESCRIPTION"></textarea>';
        template += '<select ng-model="stdFormData.obj_product_description_' + i + '" class="new-form" ng-change="setProductDetails(' + i + ')" ng-click="setSelection(' + i + ')">';
        template += '<option value="" selected>---</option>';
        template += '<option ng-repeat="pd in productDescriptions2[' + i + ']" value="{{pd}}">{{pd}}</option>';
        template += '</select>';
        template += '</td>';
        template += '<td>';
        template += '<input type="text" id="obj_product_code_' + i + '" ng-model="stdFormData.obj_product_code_' + i + '" readonly>';
        template += '</td>';
        template += '<td>';
        template += '<input type="number" id="obj_regular_' + i + '" ng-model="stdFormData.obj_regular_' + i + '" caption="PRODUCT QTY" ng-change="setFreeQTY(' + i + ')" onkeypress="return isNumberKey(event)">';
        template += '</td>';
        template += '<td>';
        template += '<input type="number" id="obj_free_' + i + '" ng-model="stdFormData.obj_free_' + i + '" onkeypress="return isNumberKey(event)">';
        template += '</td>';
        template += '<td>';
        template += '<input type="text" id="obj_price_' + i + '" ng-model="stdFormData.obj_price_' + i + '" readonly price style="text-align:right">';
        template += '</td>';
        template += '<td>';
        template += '<input type="number" id="obj_special_price_' + i + '" ng-model="stdFormData.obj_special_price_' + i + '" ng-change="calculateTotal(' + i + ')" onkeypress="return isNumberKey(event)">';
        template += '</td>';
        template += '<td>';
        template += '<input type="number" id="obj_discount_' + i + '" ng-model="stdFormData.obj_discount_' + i + '" ng-change="calculateTotal(' + i + ')" onkeypress="return isNumberKey(event)">';
        template += '</td>';
        template += '<td>';
        template += '<input type="text" id="obj_sum_' + i + '" ng-model="stdFormData.obj_sum_' + i + '" readonly style="display:none">';
        template += '<input type="text" id="obj_sum_' + i + '_1" ng-model="stdFormData.obj_sum_' + i + '_1" readonly price style="text-align:right">';
        template += '</td>';
        template += '</tr>';

    }
    return {
        template: template
    };
});

app.directive('trView', function () {
    var template = "";
    for (var i = 1; i <= 20; i++) {
        if (i <= 5) {
            template += '<tr>';
        } else {
            template += '<tr style="display:none" id="view_row' + i + '">';
        }
        template += '<td id="vw_principal_' + i + '" style="border:1px solid lightgray; padding:4px">&nbsp;</td>';
        template += '<td id="vw_product_description_' + i + '" style="border:1px solid lightgray; padding:4px"></td>';
        template += '<td id="vw_product_code_' + i + '" style="border:1px solid lightgray; text-align:center"></td>';
        template += '<td id="vw_regular_' + i + '" style="border:1px solid lightgray; padding:4px; text-align:right"></td>';
        template += '<td id="vw_free_' + i + '" style="border:1px solid lightgray; padding:4px; text-align:right"></td>';
        template += '<td id="vw_price_' + i + '" style="border:1px solid lightgray; padding:4px; text-align:right"></td>';
        template += '<td id="vw_special_price_' + i + '" style="border:1px solid lightgray; padding:4px; text-align:right"></td>';
        template += '<td id="vw_discount_' + i + '" style="border:1px solid lightgray; padding:4px; text-align:right"></td>';
        template += '<td id="vw_sum_' + i + '_1" style="border:1px solid lightgray; padding:4px; text-align:right"></td>';
        template += '</tr>';

    }
    return {
        template: template
    };
});

app.directive('price', function (numberFilter) {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$formatters.unshift(function (modelValue) {
                return numberFilter(modelValue, 2);
            });
        }
    };
});

app.filter('pretty', function () {
    return function (input) {
        var temp;
        try {
            temp = angular.fromJson(input);
        } catch (e) {
            temp = input;
        }
        return angular.toJson(temp, true);
    };
});