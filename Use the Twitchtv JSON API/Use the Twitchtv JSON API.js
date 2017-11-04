$(document).ready(function(){
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

      users.forEach(function(item){
        //获取主播是否在线
        $.ajax({
                  type: "GET",
                  url: urlbase+searchtype[1]+item+'?callback=?',
                  dataType: "json",
                  success: function(streamData){
                    if(streamData.stream===null){
                      lineState="Offline";
                      lineStateIcon="glyphicon-remove-circle";  
                    }else{
                      lineState="Online";
                      lineStateIcon="glyphicon-ok-circle";
                    }
                    //获取主播信息
                    $.ajax({
                                type: "GET",
                                url: urlbase+searchtype[0]+item+'?callback=?',
                                dataType: "json",
                                success: function(data){searchByChannel(data);}
                      });
                  }
        });
      });

          //点击时改变导航按钮样式
      $('ul.nav-tabs li').click(function(){
        $('ul.nav-tabs li').removeClass('active');
        $(this).addClass('active');
        $('input[name="search"]').val('');
      });

          //点击all展示数组中的所有主播
      $('ul.nav-tabs li').eq(0).click(function(){
        $('.usershow').show();
        
        if(hasSearch){//当用户点击过搜索后，再切换回导航栏的all，需要重新加载all数据
            //清空当前数据，显示加载中
            $('.isLoading').show();
            $('#tvInfo').empty();
            users.forEach(function(item){
              //获取是否在线
            $.ajax({
                      type: "GET",
                      url: urlbase+searchtype[1]+item+'?callback=?',
                      dataType: "json",
                      success: function(streamData){
                        if(streamData.stream===null){
                          lineState="Offline";
                          lineStateIcon="glyphicon-remove-circle";  
                        }else{
                          console.log('stream涓嶄负null');
                          lineState="Online";
                          lineStateIcon="glyphicon-ok-circle";
                        }
                        //获取主播信息
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
        }//end if

      });

      //展示在线的主播
      $('ul.nav-tabs li').eq(1).click(function(){
        $('.Offline').hide();
        $('.Online').show();
        
        if(hasSearch){//当用户点击过搜索后，再切换回导航栏的online，需要重新加载online的主播
            $('.isLoading').show();
            $('#tvInfo').empty(); //清空展示当前的主播
            //搜索状态为在线的主播
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
                          
                          lineState="Online";
                          lineStateIcon="glyphicon-ok-circle";
                          //获取该主播信息
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
        }//end if
      });

      //展示不在线的主播
      $('ul.nav-tabs li').eq(2).click(function(){
        $('.Online').hide();
        $('.Offline').show();

        if(hasSearch){

            $('.isLoading').show();
            $('#tvInfo').empty();//清空当前展示的主播
            users.forEach(function(item){
            //获取不在线的主播
            $.ajax({
                      type: "GET",
                      url: urlbase+searchtype[1]+item+'?callback=?',
                      dataType: "json",
                      success: function(streamData){
                        if(streamData.stream===null){
                          lineState="Offline";
                          lineStateIcon="glyphicon-remove-circle";
                          //获取该主播信息
                          $.ajax({
                                    type: "GET",
                                    url: urlbase+searchtype[0]+item+'?callback=?',
                                    dataType: "json",
                                    success: function(data){searchByChannel(data);}
                          });  
                        }else{
                          lineState="Online";
                          lineStateIcon="glyphicon-ok-circle";
                        }
                        
                      }
              });
            });
            hasSearch=false;
        }//end if

      });

      
      $('.input-group span').click(function(){
        $('ul.nav-tabs li').removeClass('active');
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
                  
                                  var imgUrl="https://static-cdn.jtvnw.net/jtv_user_pictures/freecodecamp-profile_image-d9514f2df0962329-300x300#.png";//当json数据中图片地址为空时，默认用这个地址
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

});

