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
        //get user's state of online/offline
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
                    //get user's other information
                    $.ajax({
                                type: "GET",
                                url: urlbase+searchtype[0]+item+'?callback=?',
                                dataType: "json",
                                success: function(data){searchByChannel(data);}
                      });
                  }
        });
      });

          //change the style of navigation button when click
      $('ul.nav-tabs li').click(function(){
        $('ul.nav-tabs li').removeClass('active');
        $(this).addClass('active');
        $('input[name="search"]').val('');
      });

          //show all users
      $('ul.nav-tabs li').eq(0).click(function(){
        $('.usershow').show();
        
        if(hasSearch){
            //search all again
            $('.isLoading').show();
            $('#tvInfo').empty();
            users.forEach(function(item){
              //get the state of online/offline
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
                        //get more information about user
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

      //show users online
      $('ul.nav-tabs li').eq(1).click(function(){
        $('.Offline').hide();
        $('.Online').show();
        
        if(hasSearch){
            $('.isLoading').show();
            $('#tvInfo').empty(); //clear the users information
            //search the user  online 
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
                          //get the more detail information about the user
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

      //show users offline
      $('ul.nav-tabs li').eq(2).click(function(){
        $('.Online').hide();
        $('.Offline').show();

        if(hasSearch){

            $('.isLoading').show();
            $('#tvInfo').empty();//clear the users information
            users.forEach(function(item){
            //get the user offline
            $.ajax({
                      type: "GET",
                      url: urlbase+searchtype[1]+item+'?callback=?',
                      dataType: "json",
                      success: function(streamData){
                        if(streamData.stream===null){
                          lineState="Offline";
                          lineStateIcon="glyphicon-remove-circle";
                          //get the more detail information about the user
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
                  
                                  var imgUrl="https://static-cdn.jtvnw.net/jtv_user_pictures/freecodecamp-profile_image-d9514f2df0962329-300x300#.png";//when the picture address is null, show this one
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

