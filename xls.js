var xls = angular.module('xls', []);
xls.controller('XlsCtrl', function ($scope) {
    $scope.handleFile = function (e) {
        $scope.data = [];
        var files = e.files;
        var i, f;

        var headers = {
            A: 'name', B: 'address'
        };
        var dataRowStart = 2;

        for (i = 0, f = files[i]; i != files.length; ++i) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var data = e.target.result;

                var workbook = XLSX.read(data, { type: 'binary' });
                var tml = workbook.Sheets[workbook.SheetNames[0]];

                var data = [];
                var headers = {};
                //default
                for (var z in tml) {
                    if (z[0] === '!')
                        continue;
                    var tt = 0;
                    for (var i = 0; i < z.length; i++) {
                        if (!isNaN(z[i])) {
                            tt = i;
                            break;
                        }
                    }
                    var col = z.substring(0, tt);
                    var row = parseInt(z.substring(tt));
                    var value = tml[z].v;

                    if (row == 5) {
                        value = value.toLowerCase().replace(/\s/g, '_').replace(/[.]/g, '');
                        headers[col] = value;
                    }

                    if (row > 5) {
                        if (!data[row]) {
                            data[row] = {};
                        }
                        var h = headers[col];
                        if (h.indexOf('date') !== -1) {
                            value = excelDateToJSDate(value);
                        }
                        data[row][h] = value;
                    }
                }
                console.log(data);
                $scope.$apply(function(){
                    $scope.data = data;
                });
            };

        }
        reader.readAsBinaryString(f);

        function excelDateToJSDate(serial) {
            var utc_days = Math.floor(serial - 25569);
            var utc_value = utc_days * 86400;
            var date_info = new Date(utc_value * 1000);
            var fractional_day = serial - Math.floor(serial) + 0.0000001;
            var total_seconds = Math.floor(86400 * fractional_day);
            var seconds = total_seconds % 60;
            total_seconds -= seconds;
            var hours = Math.floor(total_seconds / (60 * 60));
            var minutes = Math.floor(total_seconds / 60) % 60;
            var _d = new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
            return _d.getFullYear() + '-' + ('0' + (_d.getMonth() + 1)).slice(-2) + '-' + ('0' + _d.getDate()).slice(-2);
        }
    };
});