<?php

  date_default_timezone_set('America/New_York');
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Method:GET, POST');
  header('Access-Control-Allow-Headers:x-requested-with,content-type');

  $jsonData= array();$jsonAuto= array(); $jsonPrice= array();
  $jsonSMA= array();  $jsonEMA= array(); $jsonSTOCH= array();
  $jsonRSI= array(); $jsonADX= array(); $jsonCCI= array();
  $jsonBBANDS= array(); $jsonMACD= array();
//Backend file to get data from APIs
  //AutoComplete Data
  if(!empty($_GET['query'])) {
        $query = $_GET['query'];
        $url = "http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json?input=".$query;
        $content = file_get_contents($url);
        $jsonAuto['auto'] = json_decode($content);
        echo json_encode($jsonAuto);
    }

    if (($_GET['type'])=="price" && isset($_GET['symbol'])) {
      //Symbol & API Key
      $symbol=$_GET['symbol'];
      $api_key='&apikey=CGUIIJYUTNYIIA50';
      //Price JSON
      $url='https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=';
      $output_size='&outputsize=full';
      $content=file_get_contents($url.$symbol.$output_size.$api_key);
      $jsonPrice['price']= json_decode($content);
      //Intraday JSON
      $symbol=$_GET['symbol'];
      $api_key='&apikey=CGUIIJYUTNYIIA50';
      $url='https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=';
      $interval='&interval=1min';
      $content=file_get_contents($url.$symbol.$interval.$api_key);
      $jsonPrice['intra']= json_decode($content);
      echo json_encode($jsonPrice);
    }

    if (($_GET['type'])=="SMA" && isset($_GET['symbol'])) {
      //SMA JSON
      $symbol=$_GET['symbol'];
      $api_key='&apikey=CGUIIJYUTNYIIA50';
      $url='https://www.alphavantage.co/query?function=SMA&symbol=';
      $interval='&interval=daily&time_period=10&series_type=close&';
      $content=file_get_contents($url.$symbol.$interval.$api_key);
      $jsonSMA['SMA'] = json_decode($content);
      echo json_encode($jsonSMA);
    }
    if (($_GET['type'])=="EMA" && isset($_GET['symbol'])) {
      //EMA JSON
      $symbol=$_GET['symbol'];
      $api_key='&apikey=CGUIIJYUTNYIIA50';
      $url='https://www.alphavantage.co/query?function=EMA&symbol=';
      $interval='&interval=daily&time_period=10&series_type=close';
      $content=file_get_contents($url.$symbol.$interval.$api_key);
      $jsonEMA['EMA'] = json_decode($content);
      echo json_encode($jsonEMA);
    }
    if (($_GET['type'])=="STOCH" && isset($_GET['symbol'])) {
      //STOCH JSON
      $symbol=$_GET['symbol'];
      $api_key='&apikey=IZCXD5CRYW6ZC2MU';
      $url='https://www.alphavantage.co/query?function=STOCH&symbol=';
      $interval='&interval=daily&slowkmatype=1&slowdmatype=1';
      $content=file_get_contents($url.$symbol.$interval.$api_key);
      $jsonSTOCH['STOCH'] = json_decode($content);
      echo json_encode($jsonSTOCH);
    }
    if (($_GET['type'])=="RSI" && isset($_GET['symbol'])) {
      //RSI JSON
      $symbol=$_GET['symbol'];
      $api_key='&apikey=IZCXD5CRYW6ZC2MU';
      $url='https://www.alphavantage.co/query?function=RSI&symbol=';
      $interval='&interval=daily&time_period=10&series_type=close';
      $content=file_get_contents($url.$symbol.$interval.$api_key);
      $jsonRSI['RSI'] = json_decode($content);
      echo json_encode($jsonRSI);
    }
    if (($_GET['type'])=="ADX" && isset($_GET['symbol'])) {
      //ADX JSON
      $symbol=$_GET['symbol'];
      $api_key='&apikey=IZCXD5CRYW6ZC2MU';
      $url='https://www.alphavantage.co/query?function=ADX&symbol=';
      $interval='&interval=daily&time_period=10';
      $content=file_get_contents($url.$symbol.$interval.$api_key);
      $jsonADX['ADX'] = json_decode($content);
      echo json_encode($jsonADX);
    }

    if (($_GET['type'])=="CCI" && isset($_GET['symbol'])) {
      //CCI JSON
      $symbol=$_GET['symbol'];
      $api_key='&apikey=VHJIKALIY5JBH09T';
      $url='https://www.alphavantage.co/query?function=CCI&symbol=';
      $interval='&interval=daily&time_period=10';
      $content=file_get_contents($url.$symbol.$interval.$api_key);
      $jsonCCI['CCI'] = json_decode($content);
      echo json_encode($jsonCCI);
    }
    if (($_GET['type'])=="BBANDS" && isset($_GET['symbol'])) {
      //BBANDS JSON
      $symbol=$_GET['symbol'];
      $api_key='&apikey=VHJIKALIY5JBH09T';
      $url='https://www.alphavantage.co/query?function=BBANDS&symbol=';
      $interval='&interval=daily&time_period=5&series_type=close&nbdevup=3&nbdevdn=3';
      $content=file_get_contents($url.$symbol.$interval.$api_key);
      $jsonBBANDS['BBANDS'] = json_decode($content);
      echo json_encode($jsonBBANDS);
    }
    if (($_GET['type'])=="MACD" && isset($_GET['symbol'])) {
      //MACD JSON
      $symbol=$_GET['symbol'];
      $api_key='&apikey=VHJIKALIY5JBH09T';
      $url='https://www.alphavantage.co/query?function=MACD&symbol=';
      $interval='&interval=daily&series_type=close&fastperiod=12';
      $content=file_get_contents($url.$symbol.$interval.$api_key);
      $jsonMACD['MACD'] = json_decode($content);
      echo json_encode($jsonMACD);
    }

    if (($_GET['type'])=="News" && isset($_GET['symbol'])) {
      //News JSON
      $symbol=$_GET['symbol'];

      $url_xml='https://seekingalpha.com/api/sa/combined/';
      $xmlData=simplexml_load_file($url_xml.$symbol.'.xml');
      $urlArray=array();
      $dateArray=array();
      $titleArray=array();
      $authorArray=array();
      $j=0;
      foreach($xmlData->channel as $value) {
                  foreach($value as $item) {
                    $url_string= $item->link;
                    if (strpos($url_string,'article') !== false) {
                      $urlArray[$j]= $item->link;
                      $pub_date=$item->pubDate;
                      $titleArray[$j]=$item->title;
                      $dateArray[$j]= date('D, j M Y H:i:s T', strtotime($pub_date));
                      $authorArray[$j]=$item->children('sa',true)->author_name;
                      $j++;
                    }
                    if ($j==5) {
                      break;
                    }
                  }
                }
      $jsonData['News']=array('url'=>$urlArray,'date'=>$dateArray,'title'=>$titleArray,'author'=>$authorArray);
      echo json_encode($jsonData);
    }

?>
