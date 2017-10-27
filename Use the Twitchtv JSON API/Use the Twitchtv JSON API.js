$(document).ready(function(){
  //默认是展示All的内容，
  var users=["freecodecamp", 
             "storbeck", 
             "terakilobyte", 
             "habathcx",
             "RobotCaleb",
             "thomasballinger",
             "noobs2ninjas",
             "beohoff"],
      searchtype=['channels/','streams/'],
      urlbase='https://wind-bow.gomix.me/twitch-api/',

      searchword,
      lineState,
      lineStateIcon,
      hasSearch=false;
      //获取stream速度较慢，会产生时间差，导致On/Off line的值异常
      //获取数据至变量，闭包(先访问stream，对stream的结果进行判断，再访问channel；最后显示在HTML)
      users.forEach(function(item){
        //获取stream
        $.ajax({
                  type: "GET",
                  url: urlbase+searchtype[1]+item+'?callback=?',
                  dataType: "json",
                  success: function(streamData){
                    if(streamData.stream===null){
                      lineState="Offline";
                      lineStateIcon="glyphicon-remove-circle";  
                    }else{
                      console.log('stream不为null');
                      lineState="Online";
                      lineStateIcon="glyphicon-ok-circle";
                    }
                    //获取channel
                    $.ajax({
                                type: "GET",
                                url: urlbase+searchtype[0]+item+'?callback=?',
                                dataType: "json",
                                success: function(data){searchByChannel(data);}
                      });
                  }
        });
      });

      //给按钮绑定事件
          //按钮样式变化
      $('ul.nav-tabs li').click(function(){
        $('ul.nav-tabs li').removeClass('active');
        $(this).addClass('active');
        $('input[name="search"]').val('');
      });
          //内容显示变化
      $('ul.nav-tabs li').eq(0).click(function(){
        $('.usershow').show();
        //input清空

        if(hasSearch){
            //
            $('.isLoading').show();
            $('#tvInfo').empty();
            users.forEach(function(item){
            $.ajax({
                      type: "GET",
                      url: urlbase+searchtype[1]+item+'?callback=?',
                      dataType: "json",
                      success: function(streamData){
                        if(streamData.stream===null){
                          lineState="Offline";
                          lineStateIcon="glyphicon-remove-circle";  
                        }else{
                          console.log('stream不为null');
                          lineState="Online";
                          lineStateIcon="glyphicon-ok-circle";
                        }
                        //获取channel
                        $.ajax({
                                    type: "GET",
                                    url: urlbase+searchtype[0]+item+'?callback=?',
                                    dataType: "json",
                                    success: function(data){searchByChannel(data);}
                          });
                      }
              });
            });
            hasSearch=false;
        }//if结束

      });

      $('ul.nav-tabs li').eq(1).click(function(){
        $('.Offline').hide();
        $('.Online').show();
        //input清空
        if(hasSearch){
            //
            $('.isLoading').show();
            $('#tvInfo').empty();
            users.forEach(function(item){
            $.ajax({
                      type: "GET",
                      url: urlbase+searchtype[1]+item+'?callback=?',
                      dataType: "json",
                      success: function(streamData){
                        if(streamData.stream===null){
                          lineState="Offline";
                          lineStateIcon="glyphicon-remove-circle";  
                        }else{
                          console.log('stream不为null');
                          lineState="Online";
                          lineStateIcon="glyphicon-ok-circle";
                          //获取channel
                          $.ajax({
                                    type: "GET",
                                    url: urlbase+searchtype[0]+item+'?callback=?',
                                    dataType: "json",
                                    success: function(data){searchByChannel(data);}
                          });
                        }
                        
                      }
              });
            });
            hasSearch=false;
        }//if结束
      });

      $('ul.nav-tabs li').eq(2).click(function(){
        $('.Online').hide();
        $('.Offline').show();
        //input清空

        if(hasSearch){
            //
            $('.isLoading').show();
            $('#tvInfo').empty();
            users.forEach(function(item){
            $.ajax({
                      type: "GET",
                      url: urlbase+searchtype[1]+item+'?callback=?',
                      dataType: "json",
                      success: function(streamData){
                        if(streamData.stream===null){
                          lineState="Offline";
                          lineStateIcon="glyphicon-remove-circle";
                          //获取channel
                          $.ajax({
                                    type: "GET",
                                    url: urlbase+searchtype[0]+item+'?callback=?',
                                    dataType: "json",
                                    success: function(data){searchByChannel(data);}
                          });  
                        }else{
                          console.log('stream不为null');
                          lineState="Online";
                          lineStateIcon="glyphicon-ok-circle";
                        }
                        
                      }
              });
            });
            hasSearch=false;
        }//if结束

      });

      //input 聚焦时 $('ul.nav-tabs li').removeClass('active');
      $('.input-group span').click(function(){
        $('ul.nav-tabs li').removeClass('active');
        //console.log($('input[name="search"]').val());
        $('.isLoading').show();
        $('#tvInfo').empty();
        var searchContent= $('input[name="search"]').val();
        $.ajax({
                  type: "GET",
                  url: urlbase+searchtype[0]+searchContent+'?callback=?',
                  dataType: "json",
                  success: function(data){searchByChannel(data);}         
        });
        hasSearch=true;
      });


      function searchByChannel(channelData){
                                  //https://static-cdn.jtvnw.net/jtv_user_pictures/freecodecamp-profile_image-d9514f2df0962329-300x300#.png
                                  var imgUrl="https://static-cdn.jtvnw.net/jtv_user_pictures/freecodecamp-profile_image-d9514f2df0962329-300x300#.png";//图片地址为null时，用其显示
                                  if(channelData.logo){
                                    imgUrl=channelData.logo;
                                  }
                                  var nameText=channelData.display_name,
                                      aUrl=channelData.url,
                                      followNum=channelData.followers,
                                      viewNum=channelData.views;
                                  var content='<div class="row usershow '+lineState+'"><div class="col-sm-3 col-xs-3 pictureShow"><img class="img-responsive img-circle" src="'
                                                +imgUrl+'"></div><div class="col-sm-9 col-xs-9 details"><p class="text-center"><span class="glyphicon '
                                                +lineStateIcon+'"></span>&nbsp;<span>'+lineState+'</span></p><h4><a href="'+aUrl+'" target="_blank"><span class="glyphicon glyphicon-user"></span>&nbsp;'
                                                + nameText +'</a></h4><div class="botInfo"><p><span class="glyphicon glyphicon-heart-empty"></span>&nbsp;<span>'
                                                +followNum+'</span></p><p><span>'
                                                +viewNum+'</span>&nbsp;<span class="glyphicon glyphicon-eye-open"></span></p></div></div></div>';
                                  $('.isLoading').hide();
                                  $('#tvInfo').append(content);
                                }
      //建立一个触发all按钮的事件

    
      //checkIsOnline(searchword);
      //searchInfo(searchword);
      //console.log(checkIsOnline(searchword)[1]);

  /*
  function checkIsOnline(word){
    $.ajax({
              type: "GET",
              url: urlbase+searchtype[1]+word+'?callback=?',
              dataType: "json",
              success: function(data){
                //
                if(data.stream==null){
                  lineStateIcon='glyphicon-question-sign';//
                  lineState='Offline';
                }else{
                  lineStateIcon='glyphicon-ok-circle';//
                  lineState='Online';
                }
              }
    });
    return [lineStateIcon,lineState];
  }
  function searchInfo(word){
    $.ajax({
        type: "GET",
        url: urlbase+searchtype[0]+word+'?callback=?',
        dataType: "json",
        success: function(data){
          //console.log(data);
          dealWith(data);
        }
         });
  }
  function dealWith(dem){
    //将数据添加、展示在html中
    //如果是离线状态，设置图片透明度为opacity:0.4;
    var imgUrl="#";
    if(dem.logo){
      imgUrl=dem.logo;
    }
    var nameText=dem.display_name,
        aUrl=dem.url,
        followNum=dem.followers,
        viewNum=dem.views;
    var content='<div class="row usershow"><div class="col-sm-3 pictureShow"><img class="img-responsive img-circle" src="'
                  +imgUrl+'"></div><div class="col-sm-9 details"><p><span class="glyphicon '
                  +checkIsOnline(searchword)[0]+'"></span>&nbsp;<span>'+checkIsOnline(searchword)[1]+'</span></p><h4><span class="glyphicon glyphicon-user"></span>&nbsp;'
                  + nameText +'</h4><p><a href="'+aUrl+'">'
                  +aUrl+'</a></p><div class="botInfo"><p><span class="glyphicon glyphicon-heart-empty"></span>&nbsp;<span>'
                  +followNum+'</span></p><p><span>'
                  +viewNum+'</span>&nbsp;<span class="glyphicon glyphicon-eye-open"></span></p></div></div></div>';

    $('#tvInfo').append(content);
  }
  */
});

