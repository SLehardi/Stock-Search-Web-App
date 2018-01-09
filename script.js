var jsonData;
var jsonPrice;  var jsonSMA; var jsonEMA; var jsonSTOCH; var jsonRSI;
var jsonADX; var jsonCCI; var jsonBBANDS; var jsonMACD;
var symbol; var change; var changeper;var lastprice;var volume;
var stockList = {};
var urlPrice; var urlSMA; var urlEMA;
var urlSTOCH; var urlRSI; var urlADX;
var urlCCI; var urlBBANDS; var urlMACD;
function changeFormat(date) {
  var r = date.match(/^\s*([0-9]+)\s*-\s*([0-9]+)\s*-\s*([0-9]+)(.*)$/);
  return r[2]+"/"+r[3];
}

//Function to clear all fields and refresh to empty details
function clearData() {
  jsonData=[];
  jsonPrice=[]; jsonSMA=[]; jsonEMA=[]; jsonSTOCH=[]; jsonRSI=[];
  jsonADX=[]; jsonCCI=[]; jsonBBANDS=[]; jsonMACD=[];
  $("#tableId > tbody").empty();
  $("#news").empty();
  $("#historic").empty();
  $("#hc > .tab-pane >.chartPane").empty();
  $("#shareBtn").prop("disabled", true);
  $("#btn-star").prop("disabled", true);
  $("#right").prop("disabled", true);
}

//Gets price information to display the price chart and export to Facebook
function changePrice(divElement){
  var priceJson=jsonPrice.price;
  var priceDate=[];var priceArr=[];var priceVol=[];var countP=0;
  for(var date in priceJson["Time Series (Daily)"]){
    var dateNew=changeFormat(date);
    priceDate.push(dateNew);
    var price=parseFloat(priceJson["Time Series (Daily)"][date]["4. close"]);
    var volume=parseFloat(priceJson["Time Series (Daily)"][date]["5. volume"]);
    priceArr.push(price);
    priceVol.push(volume);
    countP ++;
    if(countP>129){
      priceArr.reverse();
      priceDate.reverse();
      priceVol.reverse();
      break;
    }
  }
  Highcharts.chart(divElement, {
    chart: {
        type: 'column',
        zoomType:'x'
    },
    title: {
        text: priceJson['Meta Data']['2. Symbol']+' Stock Price and Volume'
    },
    subtitle: {
        text: ' <a href="https://www.alphavantage.co/">Source: Alpha Vantage</a>',
        style: {
          color: '#0000ff',
        }
    },
    xAxis: {
      categories:priceDate,
      tickInterval:5
    },
    yAxis: [{
      title: {
      text: 'Stock Price'
      },
      labels: {
        format: '{value}'
      },
        maxPadding: 0.05,
        minPadding:0.20,
      },
      {
        floor: 0,
        title: {
          text: 'Volume'
        },
        labels: {
          formatter: function () {
            return this.value / 1000000 + 'M';
          }
      },
      opposite: true,
      maxPadding: 3.0
    }],
    legend: {

    },
    plotOptions: {
      column: {
        pointWidth: .5,
        pointPadding: 10

    },
      area: {
        lineWidth: .8,
        fillOpacity: 0.5,
          marker: {
            enabled: false,
            symbol: 'circle',
            radius: 2,
            states: {
              hover: {
                enabled: true
              }
            }
          },
            threshold: null
      }
    },
    series: [{
      type: 'area',
      name: priceJson['Meta Data']['2. Symbol'],
      data: priceArr,
      color: '#0000ff'
    },
    {
      type: 'column',
      name: priceJson['Meta Data']['2. Symbol']+" Volume",
      yAxis: 1,
      data: priceVol,
      color: '#ff0000'
    }]
  });

  var exportUrl = 'http://export.highcharts.com/';
  var optionsStr = JSON.stringify({
    chart: {
        type: 'column',
        zoomType:'x'
    },
    title: {
        text: priceJson['Meta Data']['2. Symbol']+' Stock Price and Volume'
    },
    subtitle: {
        text: ' <a href="https://www.alphavantage.co/">Source: Alpha Vantage</a>',
        style: {
          color: '#0000ff',
        }
    },
    xAxis: {
      categories:priceDate,
      tickInterval:5
    },
    yAxis: [{
      title: {
      text: 'Stock Price'
      },
      labels: {
        format: '{value}'
      },
        maxPadding: 0.05,
        minPadding:0.20,
      },
      {
        floor: 0,
        title: {
          text: 'Volume'
        },
        labels: {
          formatter: function () {
            return this.value / 1000000 + 'M';
          }
      },
      opposite: true,
      maxPadding: 3.0
    }],
    legend: {

    },
    plotOptions: {
      column: {
        pointWidth: .5,
        pointPadding: 10

    },
      area: {
        lineWidth: .8,
        fillOpacity: 0.5,
          marker: {
            enabled: false,
            symbol: 'circle',
            radius: 2,
            states: {
              hover: {
                enabled: true
              }
            }
          },
            threshold: null
      }
    },
    series: [{
      type: 'area',
      name: priceJson['Meta Data']['2. Symbol'],
      data: priceArr,
      color: '#0000ff'
    },
    {
      type: 'column',
      name: priceJson['Meta Data']['2. Symbol']+" Volume",
      yAxis: 1,
      data: priceVol,
      color: '#ff0000'
    }]

  }),
  dataString = encodeURI('async=true&type=jpeg&width=400&options=' + optionsStr);

  if (window.XDomainRequest) {
      var xdr = new XDomainRequest();
      xdr.open("post", exportUrl+ '?' + dataString);
      xdr.onload = function () {

          $('#container').html('<img src="' + exporturl + xdr.responseText + '"/>');
      };
      xdr.send();
  } else {
      $.ajax({
          type: 'POST',
          data: dataString,
          url: exportUrl,
          success: function (data) {

              $('#container').html('<img src="' + exportUrl + data + '"/>');

              urlPrice=exportUrl+data;
          },
          error: function (err) {
              debugger;
              console.log('error', err.statusText)
          }
      });
  }
}

//Gets SMA information to display the chart and export to Facebook
function changeSMA(divElement) {
  var data=jsonSMA.SMA;
  var smaDate=[];
  var smaArr=[];
  var count=0;
  for(var date in data["Technical Analysis: SMA"]){
      dateNew=changeFormat(date);
      smaDate.push(dateNew);
      var sma=parseFloat(data["Technical Analysis: SMA"][date]["SMA"]);
        smaArr.push(sma);
      count ++;
    if(count>129){
      smaArr.reverse();
      smaDate.reverse();
      break;
    }
  }

 Highcharts.chart(divElement, {
     chart: {
         type: 'line',
         zoomType: 'x'
     },
     title: {
         text: 'Simple Moving Average (SMA)'
     },
     subtitle: {
       text: ' <a href="https://www.alphavantage.co/">Source: Alpha Vantage</a>',
       style: {
         color: '#0000ff',
       }
     },
     yAxis: {
         title: {
             text: 'SMA'
         }
     },
     xAxis: {
         categories: smaDate,
         tickInterval: 5
     },
     legend: {

     },
     plotOptions: {
       series: {
         lineWidth: 1,
         marker: {
          radius: 2,
          symbol: 'square'
      }
  }
     },
     series: [{
         color: '#FF0000',
         name: data['Meta Data']['1: Symbol'],
         data: smaArr,

     }],
     responsive: {
         rules: [{
             condition: {
                 maxWidth: 500
             },
             chartOptions: {
                 legend: {

                 }
             }
         }]
     }
   });
   var exportUrl = 'http://export.highcharts.com/';
   var optionsStr = JSON.stringify({
     chart: {
         type: 'line',
         zoomType: 'x'
     },
     title: {
         text: 'Simple Moving Average (SMA)'
     },
     subtitle: {
       text: ' <a href="https://www.alphavantage.co/">Source: Alpha Vantage</a>',
       style: {
         color: '#0000ff',
       }
     },
     yAxis: {
         title: {
             text: 'SMA'
         }
     },
     xAxis: {
         categories: smaDate,
         tickInterval: 5
     },
     legend: {

     },
     plotOptions: {
       series: {
         lineWidth: 1,
         marker: {
          radius: 2,
          symbol: 'square'
      }
  }
     },
     series: [{
         color: '#FF0000',
         name: data['Meta Data']['1: Symbol'],
         data: smaArr,

     }],
     responsive: {
         rules: [{
             condition: {
                 maxWidth: 500
             },
             chartOptions: {
                 legend: {

                 }
             }
         }]
     }

   }),
   dataString = encodeURI('async=true&type=jpeg&width=400&options=' + optionsStr);

   if (window.XDomainRequest) {
       var xdr = new XDomainRequest();
       xdr.open("post", exportUrl+ '?' + dataString);
       xdr.onload = function () {

           $('#container').html('<img src="' + exporturl + xdr.responseText + '"/>');
       };
       xdr.send();
   } else {
       $.ajax({
           type: 'POST',
           data: dataString,
           url: exportUrl,
           success: function (data) {

               $('#container').html('<img src="' + exportUrl + data + '"/>');

               urlSMA=exportUrl+data;
           },
           error: function (err) {
               debugger;
               console.log('error', err.statusText)
           }
       });
   }
}
//Gets EMA information to display the chart and export to Facebook
function changeEMA(divElement) {
  var data=jsonEMA.EMA;
  var emaDate=[];
  var emaArr=[];

  var count=0;
  for(var date in data["Technical Analysis: EMA"]){
      dateNew=changeFormat(date);
      emaDate.push(dateNew);
      var ema=parseFloat(data["Technical Analysis: EMA"][date]["EMA"]);
        emaArr.push(ema);
      count ++;
    if(count>129){
      emaArr.reverse();
      emaDate.reverse();
      break;
    }
  }

 Highcharts.chart(divElement, {
    chart: {
           type: 'line',
           zoomType: 'x'
     },
     title: {
         text: 'Exponential Moving Average (EMA)'
     },
     subtitle: {
       text: ' <a href="https://www.alphavantage.co/">Source: Alpha Vantage</a>',
       style: {
         color: '#0000ff',
       }
     },
     yAxis: {
         title: {
             text: 'EMA'
         }
     },
     xAxis: {
         categories: emaDate,
         tickInterval: 5
     },
     legend: {

     },
     plotOptions: {
       series: {
         lineWidth: 1,
         marker: {
          radius: 2,
          symbol: 'square'
      }
  }
     },
     series: [{
         color: '#FF0000',
         name: data['Meta Data']['1: Symbol'],
         data: emaArr,

     }],
     responsive: {
         rules: [{
             condition: {
                 maxWidth: 500
             },
             chartOptions: {
                 legend: {

                 }
             }
         }]
     }
   });
   var exportUrl = 'http://export.highcharts.com/';
   var optionsStr = JSON.stringify({
     chart: {
            type: 'line',
            zoomType: 'x'
      },
      title: {
          text: 'Exponential Moving Average (EMA)'
      },
      subtitle: {
        text: ' <a href="https://www.alphavantage.co/">Source: Alpha Vantage</a>',
        style: {
          color: '#0000ff',
        }
      },
      yAxis: {
          title: {
              text: 'EMA'
          }
      },
      xAxis: {
          categories: emaDate,
          tickInterval: 5
      },
      legend: {

      },
      plotOptions: {
        series: {
          lineWidth: 1,
          marker: {
           radius: 2,
           symbol: 'square'
       }
   }
      },
      series: [{
          color: '#FF0000',
          name: data['Meta Data']['1: Symbol'],
          data: emaArr,

      }],
      responsive: {
          rules: [{
              condition: {
                  maxWidth: 500
              },
              chartOptions: {
                  legend: {

                  }
              }
          }]
      }

   }),
   dataString = encodeURI('async=true&type=jpeg&width=400&options=' + optionsStr);

   if (window.XDomainRequest) {
       var xdr = new XDomainRequest();
       xdr.open("post", exportUrl+ '?' + dataString);
       xdr.onload = function () {

           $('#container').html('<img src="' + exporturl + xdr.responseText + '"/>');
       };
       xdr.send();
   } else {
       $.ajax({
           type: 'POST',
           data: dataString,
           url: exportUrl,
           success: function (data) {

               $('#container').html('<img src="' + exportUrl + data + '"/>');

               urlEMA=exportUrl+data;
           },
           error: function (err) {
               debugger;
               console.log('error', err.statusText)
           }
       });
   }
}

//Gets STOCH information to display the chart and export to Facebook
function changeSTOCH(divElement) {
  var data=jsonSTOCH.STOCH;
  var stochDate=[];
  var stochSK=[];
  var stochSD=[];
  var count=0;
  for(var date in data["Technical Analysis: STOCH"]){
      dateNew=changeFormat(date);
      stochDate.push(dateNew);
      var stoch=parseFloat(data["Technical Analysis: STOCH"][date]["SlowK"]);
        stochSK.push(stoch);
        var stoch1=parseFloat(data["Technical Analysis: STOCH"][date]["SlowD"]);
          stochSD.push(stoch1);
      count ++;
    if(count>129){
      stochSK.reverse();
      stochSD.reverse();
      stochDate.reverse();
      break;
    }
  }

  Highcharts.chart(divElement, {
    chart: {
           type: 'line',
           zoomType: 'x'
     },
     title: {
         text: 'Stochastic Oscillator (STOCH)'
     },
     subtitle: {
       text: ' <a href="https://www.alphavantage.co/">Source: Alpha Vantage</a>',
       style: {
         color: '#0000ff',
       }
     },
     yAxis: {
         title: {
             text: 'STOCH'
         }
     },
     xAxis: {
         categories: stochDate,
         tickInterval: 5
     },
     legend: {

     },
     plotOptions: {
       series: {
         lineWidth: 1,
         marker: {
          radius: 2,
          symbol: 'square'
      }
  }
     },
     series: [{
         color: '#FF0000',
         name: data['Meta Data']['1: Symbol']+ ' SlowK',
         data: stochSK,

     },
     {
         color: '#90b4db',
         name: data['Meta Data']['1: Symbol']+ ' SlowD',
         data: stochSD,
     }],
     responsive: {
         rules: [{
             condition: {
                 maxWidth: 500
             },
             chartOptions: {
                 legend: {

                 }
             }
         }]
     }

  });
  var exportUrl = 'http://export.highcharts.com/';
  var optionsStr = JSON.stringify({
    chart: {
           type: 'line',
           zoomType: 'x'
     },
     title: {
         text: 'Stochastic Oscillator (STOCH)'
     },
     subtitle: {
       text: ' <a href="https://www.alphavantage.co/">Source: Alpha Vantage</a>',
       style: {
         color: '#0000ff',
       }
     },
     yAxis: {
         title: {
             text: 'STOCH'
         }
     },
     xAxis: {
         categories: stochDate,
         tickInterval: 5
     },
     legend: {

     },
     plotOptions: {
       series: {
         lineWidth: 1,
         marker: {
          radius: 2,
          symbol: 'square'
      }
  }
     },
     series: [{
         color: '#FF0000',
         name: data['Meta Data']['1: Symbol']+ ' SlowK',
         data: stochSK,

     },
     {
         color: '#90b4db',
         name: data['Meta Data']['1: Symbol']+ ' SlowD',
         data: stochSD,
     }],
     responsive: {
         rules: [{
             condition: {
                 maxWidth: 500
             },
             chartOptions: {
                 legend: {

                 }
             }
         }]
     }

  }),
  dataString = encodeURI('async=true&type=jpeg&width=400&options=' + optionsStr);

  if (window.XDomainRequest) {
      var xdr = new XDomainRequest();
      xdr.open("post", exportUrl+ '?' + dataString);
      xdr.onload = function () {

          $('#container').html('<img src="' + exporturl + xdr.responseText + '"/>');
      };
      xdr.send();
  } else {
      $.ajax({
          type: 'POST',
          data: dataString,
          url: exportUrl,
          success: function (data) {

              $('#container').html('<img src="' + exportUrl + data + '"/>');

              urlSTOCH=exportUrl+data;
          },
          error: function (err) {
              debugger;
              console.log('error', err.statusText)
          }
      });
  }
}

//Gets RSI information to display the chart and export to Facebook
function changeRSI(divElement) {
  var data=jsonRSI.RSI;
  var rsiDate=[];
  var rsiArr=[];

  var count=0;
  for(var date in data["Technical Analysis: RSI"]){
      dateNew=changeFormat(date);
      rsiDate.push(dateNew);
      var rsi=parseFloat(data["Technical Analysis: RSI"][date]["RSI"]);
        rsiArr.push(rsi);
      count ++;
    if(count>129){
      rsiArr.reverse();
      rsiDate.reverse();
      break;
    }
  }

 Highcharts.chart(divElement, {
   chart: {
          type: 'line',
          zoomType: 'x'
    },
     title: {
         text: 'Relative Strength Index (RSI)'
     },
     subtitle: {
       text: ' <a href="https://www.alphavantage.co/">Source: Alpha Vantage</a>',
       style: {
         color: '#0000ff',
       }
     },
     yAxis: {
         title: {
             text: 'RSI'
         }
     },
     xAxis: {
         categories: rsiDate,
         tickInterval: 5
     },
     legend: {

     },
     plotOptions: {
       series: {
         lineWidth: 1,
         marker: {
          radius: 2,
          symbol: 'square'
      }
  }
     },
     series: [{
         color: '#FF0000',
         name: data['Meta Data']['1: Symbol'],
         data: rsiArr,

     }],
     responsive: {
         rules: [{
             condition: {
                 maxWidth: 500
             },
             chartOptions: {
                 legend: {

                 }
             }
         }]
     }

 });
 var exportUrl = 'http://export.highcharts.com/';
 var optionsStr = JSON.stringify({
   chart: {
          type: 'line',
          zoomType: 'x'
    },
     title: {
         text: 'Relative Strength Index (RSI)'
     },
     subtitle: {
       text: ' <a href="https://www.alphavantage.co/">Source: Alpha Vantage</a>',
       style: {
         color: '#0000ff',
       }
     },
     yAxis: {
         title: {
             text: 'RSI'
         }
     },
     xAxis: {
         categories: rsiDate,
         tickInterval: 5
     },
     legend: {

     },
     plotOptions: {
       series: {
         lineWidth: 1,
         marker: {
          radius: 2,
          symbol: 'square'
      }
  }
     },
     series: [{
         color: '#FF0000',
         name: data['Meta Data']['1: Symbol'],
         data: rsiArr,

     }],
     responsive: {
         rules: [{
             condition: {
                 maxWidth: 500
             },
             chartOptions: {
                 legend: {

                 }
             }
         }]
     }
 }),
 dataString = encodeURI('async=true&type=jpeg&width=400&options=' + optionsStr);

 if (window.XDomainRequest) {
     var xdr = new XDomainRequest();
     xdr.open("post", exportUrl+ '?' + dataString);
     xdr.onload = function () {

         $('#container').html('<img src="' + exporturl + xdr.responseText + '"/>');
     };
     xdr.send();
 } else {
     $.ajax({
         type: 'POST',
         data: dataString,
         url: exportUrl,
         success: function (data) {

             $('#container').html('<img src="' + exportUrl + data + '"/>');

             urlRSI=exportUrl+data;
         },
         error: function (err) {
             debugger;
             console.log('error', err.statusText)
         }
     });
 }
}

//Gets ADX information to display the chart and export to Facebook
function changeADX(divElement) {
  var data=jsonADX.ADX;
  var adxDate=[];
  var adxArr=[];

  var count=0;
  for(var date in data["Technical Analysis: ADX"]){
      dateNew=changeFormat(date);
      adxDate.push(dateNew);
      var adx=parseFloat(data["Technical Analysis: ADX"][date]["ADX"]);
        adxArr.push(adx);
      count ++;
    if(count>129){
      adxArr.reverse();
      adxDate.reverse();
      break;
    }
  }

 Highcharts.chart(divElement, {
    chart: {
            type: 'line',
            zoomType: 'x'
    },
     title: {
         text: 'Average Directional Movement Index (ADX)'
     },
     subtitle: {
       text: ' <a href="https://www.alphavantage.co/">Source: Alpha Vantage</a>',
       style: {
         color: '#0000ff',
       }
     },
     yAxis: {
         title: {
             text: 'ADX'
         }
     },
     xAxis: {
         categories: adxDate,
         tickInterval: 5
     },
     legend: {

     },
     plotOptions: {
       series: {
         lineWidth: 1,
         marker: {
          radius: 2,
          symbol: 'square'
      }
  }
     },
     series: [{
         color: '#FF0000',
         name: data['Meta Data']['1: Symbol'],
         data: adxArr,

     }],
     responsive: {
         rules: [{
             condition: {
                 maxWidth: 500
             },
             chartOptions: {
                 legend: {

                 }
             }
         }]
     }

 });
 var exportUrl = 'http://export.highcharts.com/';
 var optionsStr = JSON.stringify({
   chart: {
           type: 'line',
           zoomType: 'x'
   },
    title: {
        text: 'Average Directional Movement Index (ADX)'
    },
    subtitle: {
      text: ' <a href="https://www.alphavantage.co/">Source: Alpha Vantage</a>',
      style: {
        color: '#0000ff',
      }
    },
    yAxis: {
        title: {
            text: 'ADX'
        }
    },
    xAxis: {
        categories: adxDate,
        tickInterval: 5
    },
    legend: {

    },
    plotOptions: {
      series: {
        lineWidth: 1,
        marker: {
         radius: 2,
         symbol: 'square'
     }
 }
    },
    series: [{
        color: '#FF0000',
        name: data['Meta Data']['1: Symbol'],
        data: adxArr,

    }],
    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {

                }
            }
        }]
    }
 }),
 dataString = encodeURI('async=true&type=jpeg&width=400&options=' + optionsStr);

 if (window.XDomainRequest) {
     var xdr = new XDomainRequest();
     xdr.open("post", exportUrl+ '?' + dataString);
     xdr.onload = function () {

         $('#container').html('<img src="' + exporturl + xdr.responseText + '"/>');
     };
     xdr.send();
 } else {
     $.ajax({
         type: 'POST',
         data: dataString,
         url: exportUrl,
         success: function (data) {

             $('#container').html('<img src="' + exportUrl + data + '"/>');

             urlADX=exportUrl+data;
         },
         error: function (err) {
             debugger;
             console.log('error', err.statusText)
         }
     });
 }
}

//Gets CCI information to display the chart and export to Facebook
function changeCCI(divElement) {
  var data=jsonCCI.CCI;
  var cciDate=[];
  var cciArr=[];

  var count=0;
  for(var date in data["Technical Analysis: CCI"]){
      dateNew=changeFormat(date);
      cciDate.push(dateNew);
      var cci=parseFloat(data["Technical Analysis: CCI"][date]["CCI"]);
        cciArr.push(cci);
      count ++;
    if(count>129){
      cciArr.reverse();
      cciDate.reverse();
      break;
    }
  }
  Highcharts.chart(divElement, {
    chart: {
           type: 'line',
           zoomType: 'x'
     },
     title: {
         text: 'Commodity Channel Index (CCI)'
     },
     subtitle: {
       text: ' <a href="https://www.alphavantage.co/">Source: Alpha Vantage</a>',
       style: {
         color: '#0000ff',
       }
     },
     yAxis: {
         title: {
             text: 'CCI'
         }
     },
     xAxis: {
         categories: cciDate,
         tickInterval: 5
     },
     legend: {

     },
     plotOptions: {
       series: {
         lineWidth: 1,
         marker: {
          radius: 2,
          symbol: 'square'
      }
  }
     },
     series: [{
         color: '#FF0000',
         name: data['Meta Data']['1: Symbol'],
         data: cciArr,

     }],
     responsive: {
         rules: [{
             condition: {
                 maxWidth: 500
             },
             chartOptions: {
                 legend: {

                 }
             }
         }]
     }

  });
  var exportUrl = 'http://export.highcharts.com/';
  var optionsStr = JSON.stringify({
    chart: {
           type: 'line',
           zoomType: 'x'
     },
     title: {
         text: 'Commodity Channel Index (CCI)'
     },
     subtitle: {
       text: ' <a href="https://www.alphavantage.co/">Source: Alpha Vantage</a>',
       style: {
         color: '#0000ff',
       }
     },
     yAxis: {
         title: {
             text: 'CCI'
         }
     },
     xAxis: {
         categories: cciDate,
         tickInterval: 5
     },
     legend: {

     },
     plotOptions: {
       series: {
         lineWidth: 1,
         marker: {
          radius: 2,
          symbol: 'square'
      }
  }
     },
     series: [{
         color: '#FF0000',
         name: data['Meta Data']['1: Symbol'],
         data: cciArr,

     }],
     responsive: {
         rules: [{
             condition: {
                 maxWidth: 500
             },
             chartOptions: {
                 legend: {

                 }
             }
         }]
     }
  }),
  dataString = encodeURI('async=true&type=jpeg&width=400&options=' + optionsStr);

  if (window.XDomainRequest) {
      var xdr = new XDomainRequest();
      xdr.open("post", exportUrl+ '?' + dataString);
      xdr.onload = function () {

          $('#container').html('<img src="' + exporturl + xdr.responseText + '"/>');
      };
      xdr.send();
  } else {
      $.ajax({
          type: 'POST',
          data: dataString,
          url: exportUrl,
          success: function (data) {

              $('#container').html('<img src="' + exportUrl + data + '"/>');

              urlCCI=exportUrl+data;
          },
          error: function (err) {
              debugger;
              console.log('error', err.statusText)
          }
      });
  }
}

//Gets BBANDS information to display the chart and export to Facebook
function changeBBANDS(divElement) {
  var data=jsonBBANDS.BBANDS;

  var bbandsDate=[];
  var bbandsL=[];
  var bbandsM=[];
  var bbandsU=[];
  var count=0;
  for(var date in data["Technical Analysis: BBANDS"]){
      dateNew=changeFormat(date);
      bbandsDate.push(dateNew);
      var bbands=parseFloat(data["Technical Analysis: BBANDS"][date]["Real Lower Band"]);
        bbandsL.push(bbands);
      var bbands1=parseFloat(data["Technical Analysis: BBANDS"][date]["Real Middle Band"]);
        bbandsM.push(bbands1);
      var bbands2=parseFloat(data["Technical Analysis: BBANDS"][date]["Real Upper Band"]);
        bbandsU.push(bbands2);
      count ++;

    if(count>129){
      bbandsL.reverse();
      bbandsM.reverse();
      bbandsU.reverse();
      bbandsDate.reverse();
      break;
    }
  }

 Highcharts.chart(divElement, {
     chart: {
            type: 'line',
            zoomType: 'x'
      },
     title: {
         text: 'Bollinger Bands (BBANDS)'
     },
     subtitle: {
       text: ' <a href="https://www.alphavantage.co/">Source: Alpha Vantage</a>',
       style: {
         color: '#0000ff',
       }
     },
     yAxis: {
         title: {
             text: 'BBANDS'
         }
     },
     xAxis: {
         categories: bbandsDate,
         tickInterval: 5
     },
     legend: {

     },
     plotOptions: {
       series: {
         lineWidth: 1,
         marker: {
          radius: 1.5,
          symbol: 'square'
      }
  }
     },
     series: [{
         color: '#FF0000',
         name: data['Meta Data']['1: Symbol']+ ' Real Middle Band',
         data: bbandsM,

     },
     {
         color: '#000000',
         name: data['Meta Data']['1: Symbol']+ ' Real Upper Band',
         data: bbandsU,
     },
     {
         color: '#55ed67',
         name: data['Meta Data']['1: Symbol']+ ' Real Lower Band',
         data: bbandsL,
     }],
     responsive: {
         rules: [{
             condition: {
                 maxWidth: 500
             },
             chartOptions: {
                 legend: {

                 }
             }
         }]
     }

 });
 var exportUrl = 'http://export.highcharts.com/';
 var optionsStr = JSON.stringify({
   chart: {
          type: 'line',
          zoomType: 'x'
    },
   title: {
       text: 'Bollinger Bands (BBANDS)'
   },
   subtitle: {
     text: ' <a href="https://www.alphavantage.co/">Source: Alpha Vantage</a>',
     style: {
       color: '#0000ff',
     }
   },
   yAxis: {
       title: {
           text: 'BBANDS'
       }
   },
   xAxis: {
       categories: bbandsDate,
       tickInterval: 5
   },
   legend: {

   },
   plotOptions: {
     series: {
       lineWidth: 1,
       marker: {
        radius: 1.5,
        symbol: 'square'
    }
      }
   },
   series: [{
       color: '#FF0000',
       name: data['Meta Data']['1: Symbol']+ ' Real Middle Band',
       data: bbandsM,

   },
   {
       color: '#000000',
       name: data['Meta Data']['1: Symbol']+ ' Real Upper Band',
       data: bbandsU,
   },
   {
       color: '#55ed67',
       name: data['Meta Data']['1: Symbol']+ ' Real Lower Band',
       data: bbandsL,
   }],
   responsive: {
       rules: [{
           condition: {
               maxWidth: 500
           },
           chartOptions: {
               legend: {

               }
           }
       }]
   }
 }),
 dataString = encodeURI('async=true&type=jpeg&width=400&options=' + optionsStr);

 if (window.XDomainRequest) {
     var xdr = new XDomainRequest();
     xdr.open("post", exportUrl+ '?' + dataString);
     xdr.onload = function () {

         $('#container').html('<img src="' + exporturl + xdr.responseText + '"/>');
     };
     xdr.send();
 } else {
     $.ajax({
         type: 'POST',
         data: dataString,
         url: exportUrl,
         success: function (data) {

             $('#container').html('<img src="' + exportUrl + data + '"/>');

             urlBBANDS=exportUrl+data;
         },
         error: function (err) {
             debugger;
             console.log('error', err.statusText)
         }
     });
 }
}

//Gets MACD information to display the chart and export to Facebook
function changeMACD(divElement) {
    var data=jsonMACD.MACD;
    var macdDate=[];
    var macd=[];
    var macdHist=[];
    var macdSig=[];
    var count=0;
    for(var date in data["Technical Analysis: MACD"]){
        dateNew=changeFormat(date);
        macdDate.push(dateNew);
        var macd1=parseFloat(data["Technical Analysis: MACD"][date]["MACD"]);
          macd.push(macd1);
        var macd2=parseFloat(data["Technical Analysis: MACD"][date]["MACD_Hist"]);
          macdHist.push(macd2);
        var macd3=parseFloat(data["Technical Analysis: MACD"][date]["MACD_Signal"]);
          macdSig.push(macd3);
        count ++;

      if(count>129){
        macd.reverse();
        macdHist.reverse();
        macdSig.reverse();
        macdDate.reverse();
        break;
      }
    }

  Highcharts.chart(divElement, {
    chart: {
           type: 'line',
           zoomType: 'x'
     },
     title: {
         text: 'Moving Average Convergence/Divergence (MACD)'
     },
     subtitle: {
       text: ' <a href="https://www.alphavantage.co/">Source: Alpha Vantage</a>',
       style: {
         color: '#0000ff',
       }
     },
     yAxis: {
         title: {
             text: 'MACD'
         }
     },
     xAxis: {
         categories: macdDate,
         tickInterval: 5
     },
     legend: {

     },
     plotOptions: {
       series: {
         lineWidth: 1,
         marker: {
          radius: 1.5,
          symbol: 'square'
      }
  }
     },
     series: [{
         color: '#FF0000',
         name: data['Meta Data']['1: Symbol'] + ' MACD',
         data: macd,

     },
     {
         color: '#ffa632',
         name: data['Meta Data']['1: Symbol'] + ' MACD_Hist',
         data: macdHist,
     },
     {
         color: '#7b66d6',
         name: data['Meta Data']['1: Symbol'] + ' MACD_Signal',
         data: macdSig,
     }],
     responsive: {
         rules: [{
             condition: {
                 maxWidth: 500
             },
             chartOptions: {
                 legend: {

                 }
             }
         }]
     }

  });
  var exportUrl = 'http://export.highcharts.com/';
  var optionsStr = JSON.stringify({
    chart: {
           type: 'line',
           zoomType: 'x'
     },
     title: {
         text: 'Moving Average Convergence/Divergence (MACD)'
     },
     subtitle: {
       text: ' <a href="https://www.alphavantage.co/">Source: Alpha Vantage</a>',
       style: {
         color: '#0000ff',
       }
     },
     yAxis: {
         title: {
             text: 'MACD'
         }
     },
     xAxis: {
         categories: macdDate,
         tickInterval: 5
     },
     legend: {

     },
     plotOptions: {
       series: {
         lineWidth: 1,
         marker: {
          radius: 1.5,
          symbol: 'square'
      }
  }
     },
     series: [{
         color: '#FF0000',
         name: data['Meta Data']['1: Symbol'] + ' MACD',
         data: macd,

     },
     {
         color: '#ffa632',
         name: data['Meta Data']['1: Symbol'] + ' MACD_Hist',
         data: macdHist,
     },
     {
         color: '#7b66d6',
         name: data['Meta Data']['1: Symbol'] + ' MACD_Signal',
         data: macdSig,
     }],
     responsive: {
         rules: [{
             condition: {
                 maxWidth: 500
             },
             chartOptions: {
                 legend: {

                 }
             }
         }]
     }
  }),
  dataString = encodeURI('async=true&type=jpeg&width=400&options=' + optionsStr);

  if (window.XDomainRequest) {
      var xdr = new XDomainRequest();
      xdr.open("post", exportUrl+ '?' + dataString);
      xdr.onload = function () {

          $('#container').html('<img src="' + exporturl + xdr.responseText + '"/>');
      };
      xdr.send();
  } else {
      $.ajax({
          type: 'POST',
          data: dataString,
          url: exportUrl,
          success: function (data) {

              $('#container').html('<img src="' + exportUrl + data + '"/>');

              urlMACD=exportUrl+data;
          },
          error: function (err) {
              debugger;
              console.log('error', err.statusText)
          }
      });
  }
  }

  //Creates the price chart displaying information
function priceTable(jsonPrice){
    var dataDaily=jsonPrice.price;
    var dataIntra=jsonPrice.intra;

      var j=0;
      symbol=dataDaily["Meta Data"]["2. Symbol"];
      var timestamp=dataIntra["Meta Data"]["3. Last Refreshed"];
      for(var date in dataDaily["Time Series (Daily)"]){
        if(j==0){
          var open=parseFloat(dataDaily["Time Series (Daily)"][date]["1. open"]);

          var high=parseFloat(dataDaily["Time Series (Daily)"][date]["2. high"]);

          var low=parseFloat(dataDaily["Time Series (Daily)"][date]["3. low"]);

          volume=parseFloat(dataDaily["Time Series (Daily)"][date]["5. volume"]);
        }
        if(j==1){
          var prevclose=parseFloat(dataDaily["Time Series (Daily)"][date]["4. close"]);
          break;
        }
        j++;
      }
      for(var date in dataIntra["Time Series (1min)"]){
          var stamp=date + " EDT";
          close=parseFloat(dataIntra["Time Series (1min)"][date]["4. close"]);
          lastprice=Math.round((close)*100)/100;
          break;
      }
      change=Math.round((close-prevclose)*100)/100;
      changeper=Math.round((change/prevclose*100)*100)/100;
      var html="";
      html+="<tr><td> <b>Stock Ticker Symbol</b> </td>";
      html+="<td>"+ symbol +"</td></tr>";
      html+="<tr><td> <b>Last Price</b> </td>";
      html+="<td>"+ lastprice +"</td></tr>";
      html+="<tr><td> <b>Change (Change Percent)</b> </td>";
      if(change>0){
        html+="<td><font color='green'>"+ change +" ("+changeper+"%) </font><img id='stockArrow' src='http://cs-server.usc.edu:45678/hw/hw8/images/Up.png	'></img></td></tr>";
      } else{
        html+="<td><font color='red'>"+ change +" ("+changeper+"%) </font><img id='stockArrow' src='http://cs-server.usc.edu:45678/hw/hw8/images/Down.png'></img></td></tr>";
      }
      html+="<tr><td> <b>Timestamp</b> </td>";
      html+="<td>"+ stamp +"</td></tr>";
      html+="<tr><td> <b>Open</b> </td>";
      html+="<td>"+ open +"</td></tr>";
      if(stamp.includes("16:00:00")==false){
        close=prevclose;
      }
      html+="<tr><td> <b>Close</b> </td>";
      html+="<td>"+ close +"</td></tr>";
      html+="<tr><td> <b>Day's Range</b> </td>";
      html+="<td>"+ low +" - "+high+"</td></tr>";
      html+="<tr><td> <b>Volume</b> </td>";
      html+="<td>"+ volume.toLocaleString()+"</td></tr>";

      $('#stockTable').append(html);
};

//Displays the news feed information
function newsFeed(jsonData){
  $("#news").empty();
  var data=jsonData.News;
  var html="";
  for(var l=0; l<data.author.length;l++){
    html+="<div class='newsDiv cborder rounded'>";
    html+="<div class='newsPad newsHead'><a id='newsLink' href='"+data.url[l][0]+"' target='_blank'>"+data.title[l][0]+"</a></div><br>"
    html+="<div class='newsPad newsText'>Author: "+data.author[l][0]+"</div>";
    html+="<div class='newsPad newsText'>Date: "+data.date[l]+"</div>";
    html+="</div>";
  }
  $('#news').append(html);

}

//Displays the historic chart
function changeHistoric(divElement){
  var priceJson=jsonPrice.price;
  var priceDate=[];var priceArr=[];var dataArr=[];var countP=0;
  var symbol=priceJson["Meta Data"]["2. Symbol"]
  for(var date in priceJson["Time Series (Daily)"]){
    var dateNew=new Date(date).getTime();
    var price=parseFloat(priceJson["Time Series (Daily)"][date]["4. close"]);
    dataArr.push([dateNew,price]);
    countP ++;
    if(countP>999){
      dataArr.reverse();
      break;
    }
  }
  Highcharts.stockChart(divElement, {
    chart: {

        },

        title: {
            text: symbol+' Stock Value'
        },

        subtitle: {
          text: ' <a href="https://www.alphavantage.co/">Source: Alpha Vantage</a>',
          style: {
            color: '#0000ff',
          }
        },
        yAxis: {
            title: {
                text: 'Stock Value'
            }
        },


        rangeSelector: {
        		buttons: [{
                type: 'week',
                count: 1,
                text: '1w'
            }, {
                type: 'month',
                count: 1,
                text: '1m'
            }, {
                type: 'month',
                count: 3,
                text: '3m'
            }, {
                type: 'month',
                count: 6,
                text: '6m'
            },{
                type: 'year',
                count: 1,
                text: '1y'
            }, {
                type: 'ytd',
                text: 'YTD'
            },{
                type: 'all',
                text: 'All'
            }],
            selected: 0
        },

        series: [{
            name: 'Stock Value',
            data: dataArr,
            type: 'area',
            threshold: null,
            tooltip: {
                valueDecimals: 2
            }
        }],


    });
}

//Calls data from backend to get price,SMA,EMA,STOCH,etc.
function getPrice(symbol){
  $("#barhc1,#bartable,#barhist").show();
  $.ajax({
      type: "GET",
      url: "http://lehardistock.us-east-2.elasticbeanstalk.com/stocksearch.php?type=price&symbol="+ symbol,
      dataType: "json",
      success: function(data) {
         jsonPrice=data;

         if(data.price==null||data.price["Meta Data"]==null){
          $("#barhc1,#bartable,#barhist").hide();
          $("#alerttable,#alerthistoric,#alerthc1").show();
         }
         if(data.intra==null||data.intra["Meta Data"]==null){
          $("#barhc1,#bartable,#barhist").hide();
          $("#alerttable,#alerthistoric,#alerthc1").show();
         }
         changePrice(hc1);
         changeHistoric(historic);
         priceTable(jsonPrice);
         $("#shareBtn").prop("disabled", false);
         $("#btn-star").prop("disabled", false);
         $("#right").prop("disabled", false);
         $("#barhc1,#bartable,#barhist").hide();
      },
      error: function(jqXHR) {
      $("#alerttable,#alerthistoric,#alerthc1").show();
      //alert("Error: " + jqXHR.status +" Price Error");
      $("#barhc1").hide();
   },
  })
}
function getSMA(symbol){
  $.ajax({
      type: "GET",
      url: "http://lehardistock.us-east-2.elasticbeanstalk.com/stocksearch.php?type=SMA&symbol="+ symbol,
      dataType: "json",
      success: function(data) {
         jsonSMA=data;
         if(data.SMA==null||data.SMA["Meta Data"]==null){
          $("#barhc2").hide();
           $("#alerthc2").show();
         }
         $("#barhc2").hide();
         changeSMA(hc2);
      },
      error: function(jqXHR) {
      $("#alerthc2").show();
      //alert("Error: " + jqXHR.status+" SMA Error");
      $("#barhc2").hide();
   },
  })
}
function getEMA(symbol){
  $.ajax({
      type: "GET",
      url: "http://lehardistock.us-east-2.elasticbeanstalk.com/stocksearch.php?type=EMA&symbol="+ symbol,
      dataType: "json",
      success: function(data) {
         jsonEMA=data;


         if(data.EMA==null||data.EMA["Meta Data"]==null){
          $("#barhc3").hide();
           $("#alerthc3").show();
         }
         $("#barhc3").hide();
         changeEMA(hc3);
      },
      error: function(jqXHR) {
      $("#alerthc3").show();
      //alert("Error: " + jqXHR.status+" EMA Error");
      $("#barhc3").hide();
   },
  })
}
function getSTOCH(symbol){
  $.ajax({
      type: "GET",
      url: "http://lehardistock.us-east-2.elasticbeanstalk.com/stocksearch.php?type=STOCH&symbol="+ symbol,
      dataType: "json",
      success: function(data) {
         jsonSTOCH=data;
         if(data.STOCH==null||data.STOCH["Meta Data"]==null){
          $("#barhc4").hide();
           $("#alerthc4").show();
         }
         $("#barhc4").hide();
         changeSTOCH(hc4);
      },
      error: function(jqXHR) {
      $("#alerthc4").show();
      //alert("Error: " + jqXHR.status+" STOCH Error");
      $("#barhc4").hide();
   },
  })
}
function getRSI(symbol){
  $.ajax({
      type: "GET",
      url: "http://lehardistock.us-east-2.elasticbeanstalk.com/stocksearch.php?type=RSI&symbol="+ symbol,
      dataType: "json",
      success: function(data) {
         jsonRSI=data;

         if(data.RSI==null||data.RSI["Meta Data"]==null){
          $("#barhc5").hide();
           $("#alerthc5").show();
         }
         $("#barhc5").hide();
         changeRSI(hc5);
      },
      error: function(jqXHR) {
      $("#alerthc5").show();
      //alert("Error: " + jqXHR.status+" RSI Error");
      $("#barhc5").hide();
   },
  })
}
function getADX(symbol){
  $.ajax({
      type: "GET",
      url: "http://lehardistock.us-east-2.elasticbeanstalk.com/stocksearch.php?type=ADX&symbol="+ symbol,
      dataType: "json",
      success: function(data) {
         jsonADX=data;
         if(data.ADX==null||data.ADX["Meta Data"]==null){
          $("#barhc6").hide();
           $("#alerthc6").show();
         }
         $("#barhc6").hide();
         changeADX(hc6);
      },
      error: function(jqXHR) {
      $("#alerthc6").show();
      //alert("Error: " + jqXHR.status+" ADX Error");
      $("#barhc6").hide();
   },
  })
}
function getCCI(symbol){
  $.ajax({
      type: "GET",
      url: "http://lehardistock.us-east-2.elasticbeanstalk.com/stocksearch.php?type=CCI&symbol="+ symbol,
      dataType: "json",
      success: function(data) {
         jsonCCI=data;
         if(data.CCI==null||data.CCI["Meta Data"]==null){
          $("#barhc7").hide();
           $("#alerthc7").show();
         }
         $("#barhc7").hide();
         changeCCI(hc7);
      },
      error: function(jqXHR) {
      $("#alerthc7").show();
    //  alert("Error: " + jqXHR.status+" CCI Error");
      $("#barhc7").hide();
   },
  })
}
function getBBANDS(symbol){
  $.ajax({
      type: "GET",
      url: "http://lehardistock.us-east-2.elasticbeanstalk.com/stocksearch.php?type=BBANDS&symbol="+ symbol,
      dataType: "json",
      success: function(data) {
         jsonBBANDS=data;
         if(data.BBANDS["Meta Data"]==null){
          $("#barhc8").hide();
           $("#alerthc8").show();
         }
         $("#barhc8").hide();
         changeBBANDS(hc8);
      },
      error: function(jqXHR) {
      $("#alerthc8").show();
      //alert("Error: " + jqXHR.status+" BBANDS Error");
      $("#barhc8").hide();
   },
  })
}
function getMACD(symbol){
  $.ajax({
      type: "GET",
      url: "http://lehardistock.us-east-2.elasticbeanstalk.com/stocksearch.php?type=MACD&symbol="+ symbol,
      dataType: "json",
      success: function(data) {
         jsonMACD=data;
         if(data.MACD["Meta Data"]==null){
          $("#barhc9").hide();
           $("#alerthc9").show();
         }
         $("#barhc9").hide();
         changeMACD(hc9);
      },
      error: function(jqXHR) {
      $("#alerthc9").show();
      //alert("Error: " + jqXHR.status+" MACD Error");
      $("#barhc9").hide();
   },
  })
}
function getNews(symbol){
  $.ajax({
      type: "GET",
      url: "http://lehardistock.us-east-2.elasticbeanstalk.com/stocksearch.php?type=News&symbol="+ symbol,
      dataType: "json",
      success: function(data) {
         jsonData=data;

         if(data.News.date.length==0){
          $("#barnews").hide();
          $("#alertNews").show();
         }
         $("#barnews").hide();
          newsFeed(jsonData);
      },
      error: function(jqXHR) {
      $("#alertNews").show();
      alert("Error: " + jqXHR.status+" News Error");
      $("#barnews").hide();
   },
  })
}

//On Document Ready, setup document
$(document).ready(function() {

    //Upon valid input, get stock information on click
    $("#search").click(function() {

        symbol=$('#symbol').val();
        clearData();
        $("#bar1, #bartable, #barhist, #barnews, #barhc1,#barhc2, #barhc3,#barhc4, #barhc5,#barhc6, #barhc7,#barhc8, #barhc9").show();
        $("#alerthc1,#alerthc2,#alerthc3,#alerthc4,#alerthc5,#alerthc6,#alerthc7,#alerthc8,#alerthc9,#alerttable,#alertNews,#alerthistoric").hide();
        getPrice(symbol);getSMA(symbol);getEMA(symbol);getSTOCH(symbol);getRSI(symbol);
        getADX(symbol);getCCI(symbol);getBBANDS(symbol);  getMACD(symbol);  getNews(symbol);


    })

    $("#shareBtn").prop("disabled", true);
    $("#btn-star").prop("disabled", true);
    $("#right").prop("disabled", true);
});

//Angular JS Module
var stockModule = angular.module('stockModule', ['ngMaterial','ngAnimate','storageService']);

  stockModule.controller("autocompleteController", ['$scope','$http', '$window', '$interval', 'getLocalStorage', function($scope,$http,$window,$interval,getLocalStorage){

    //Switches the active Facebook URL
    $scope.switchFunction= function(type){
      switch(type){
        case 1:
            $scope.urlFB=urlPrice;
            break;
        case 2:
            $scope.urlFB=urlSMA;
            break;
        case 3:
            $scope.urlFB=urlEMA;
            break;
        case 4:
            $scope.urlFB=urlSTOCH;
            break;
        case 5:
            $scope.urlFB=urlRSI;
            break;
        case 6:
            $scope.urlFB=urlADX ;
            break;
        case 7:
            $scope.urlFB=urlCCI;
            break;
        case 8:
            $scope.urlFB=urlBBANDS;
            break;
        case 9:
            $scope.urlFB=urlMACD;
            break;
        }
    }

    //Posts active item to Facebook
    $scope.fbPost=function(){

          if($scope.urlFB==undefined){
            $scope.urlFB=urlPrice;
          }

          FB.init({
           appId      : '293653687806819',
           status     : true,
           xfbml      : true,
           version    : 'v2.11' // or v2.6, v2.5, v2.4, v2.3
         });

         FB.ui({
						app_id:	293653687806819,
						method:	'feed',
            display: 'popup',
						picture:	$scope.urlFB
				},	(response)	=>	{
						if	(response	&&	!response.error_message)	{
										//succeed
                    alert("Posted Successfully");
						}	else	{
										//fail
                    alert("Not Posted");
						}
				});
    }

    var self = this;
    self.clear = clear;

    //Clear search field
    function clear() {
      self.selectedItem = null;
      self.searchText = "";
    }

    $scope.isShow1 = false;
    $scope.isShow2 = true;
    $scope.slide = function(fav){
      $scope.isShow1 = true;
      $scope.isShow2 = false;
    }

    //Gets autocomplete information
    this.querySearch = function(query){
      return $http.get("http://lehardistock.us-east-2.elasticbeanstalk.com/stocksearch.php?query="+query)
      .then(function(response){
        return response.data.auto;
      })
    }

    //Functions for local storage
    $scope.stockFavorites=getLocalStorage.getFavorites();
    $scope.storeFavorite=function(favorite){
    $scope.bool=false;
      var count=0;
      var index=0;
      angular.forEach($scope.stockFavorites, function (value, key) {
        if(value.symbol==favorite){
          index=count;
          $scope.bool=true;
        }
        count++;
      });
      if($scope.bool==false){
        $scope.symbol=$window.symbol;
        $scope.change=$window.change;
        $scope.changeper=$window.changeper;
        $scope.volume=$window.volume;
        $scope.lastprice=$window.lastprice;
        $scope.stockFavorites.push({ 'symbol': $scope.symbol, 'change': $scope.change, 'changeper': $scope.changeper,'volume': $scope.volume, 'lastprice': $scope.lastprice });
        getLocalStorage.updateFavorites($scope.stockFavorites);
        $scope.symbol="";
        $scope.change="";
        $scope.changeper="";
        $scope.volume="";
        $scope.lastprice="";
      } else {
        $scope.stockFavorites.splice(index, 1);
        getLocalStorage.updateFavorites($scope.stockFavorites);
      }
    }

  //Executes if item is part of favorites
  $scope.isFavorite = function(fav){
    $scope.valid=false;
    angular.forEach($scope.stockFavorites, function (value, key) {
      if(value.symbol==fav){
        $scope.valid=true;
      }
    });
    if ($scope.valid==true){
      return true;
    }
      return false;
  }
  $scope.isPositive = function(val){
    if (val<0){
      return true;
    }else{
      return false;
    }
  }

  //Executes stock search from favorites list
  $scope.textFavorite = function(symbolInput){
    clearData();
    self.searchText=symbolInput;
    $("#shareBtn").prop("disabled", true);
    $("#btn-star").prop("disabled", true);
    $("#right").prop("disabled", true);
    $("#bar1, #bartable, #barhist, #barnews, #barhc1,#barhc2, #barhc3,#barhc4, #barhc5,#barhc6, #barhc7,#barhc8, #barhc9").show();
    $("#alerthc1,#alerthc2,#alerthc3,#alerthc4,#alerthc5,#alerthc6,#alerthc7,#alerthc8,#alerthc9,#alerttable,#alertNews,#alerthistoric").hide();
    getPrice(symbolInput);getSMA(symbolInput);getEMA(symbolInput);getSTOCH(symbolInput);
    getRSI(symbolInput);getADX(symbolInput);getCCI(symbolInput);getBBANDS(symbolInput);
    getMACD(symbolInput);  getNews(symbolInput);
  }

  //Removes item from mfavorite list
  $scope.deleteFavorite = function (item) {
      $scope.stockFavorites.splice($scope.stockFavorites.indexOf(item), 1);
      getLocalStorage.updateFavorites($scope.stockFavorites);
  };

  //Refresh Favorites
  $scope.refreshFavorites=[];
  $scope.loadFavorite=function(favorite){
    return $http.get("http://lehardistock.us-east-2.elasticbeanstalk.com/stocksearch.php?type=price&symbol="+favorite)
    .then(function(response){
      var dataDaily=response.data.price;
      var dataIntra=response.data.intra;
        var j=0;

          $scope.refreshSym=favorite;


        for(var date in dataDaily["Time Series (Daily)"]){
          if(j==0){
          $scope.refreshVol=parseFloat(dataDaily["Time Series (Daily)"][date]["5. volume"]);
          }
          if(j==1){
            var prevclose=parseFloat(dataDaily["Time Series (Daily)"][date]["4. close"]);
            break;
          }
          j++;
        }
        for(var date in dataIntra["Time Series (1min)"]){
            close=parseFloat(dataIntra["Time Series (1min)"][date]["4. close"]);
            $scope.refreshLast=Math.round((close)*100)/100;
            break;
        }
        $scope.refreshCha=Math.round((close-prevclose)*100)/100;
        $scope.refreshChaP=Math.round(($scope.refreshCha/prevclose*100)*100)/100;
        $scope.refreshFavorites.push({ 'symbol': $scope.refreshSym, 'change': $scope.refreshCha, 'changeper': $scope.refreshChaP,
        'volume': $scope.refreshVol, 'lastprice': $scope.refreshLast });
        getLocalStorage.updateFavorites($scope.refreshFavorites);
        $scope.stockFavorites=getLocalStorage.getFavorites();
    })
  }

  $scope.refreshFavorite=function(){
    $scope.stockFavorites=getLocalStorage.getFavorites();
    angular.forEach($scope.stockFavorites, function (value, key) {
      $scope.loadFavorite(value.symbol);
    });
    $scope.refreshFavorites.length=0;
    $scope.refreshFavorites=[];
  }
  $scope.toggle = {
    switch:false
  };


  var promise;
  $scope.onToggle = function(cbState) {
  	if (cbState==false){
      $interval.cancel(promise);
    }else{
      promise=$interval(function() {
          $scope.refreshFavorite();
          $scope.refreshFavorites=[];
      }, 5000);
    }
  };

  //Sort Options
  $scope.listOfOptions = ['Ascending', 'Descending'];
  $scope.selectedItem='Ascending';
  $scope.reverse=false;

  $scope.selectedItemChanged = function(){
    $scope.reverse=!$scope.reverse;
  }

  $scope.disable=true;
  $scope.selectedDisable = function(){
    if($scope.sortExpression===''){
      $scope.disable=true;
    } else {
      $scope.disable=false;
    }
  }
  $scope.mySortFunction = function(item) {
		if(isNaN(item[$scope.sortExpression]))
			return item[$scope.sortExpression];
		return parseInt(item[$scope.sortExpression]);
	}
}]);

//Module to update and get favorites
  var storageService = angular.module('storageService', []);
    storageService.factory('getLocalStorage', function () {
        return {
            list: stockList,
            updateFavorites: function (StockArr) {
                if (window.localStorage && StockArr) {
                    //Local Storage to add Data
                    localStorage.setItem("stocks", angular.toJson(StockArr));
                }
                stockList= StockArr;
            },
            getFavorites: function () {
                //Get data from Local Storage
                stockList = angular.fromJson(localStorage.getItem("stocks"));
                return stockList ? stockList : [];
            }
        };
    });
