function userStatsUpdate(user) {
    username = user;
    console.log(username);
    sendAPIreq();
    following();
    messageCount();
    activity();
    showProjectStats();
}

// SendAPIreq -> getIcon & getID & getJoinDate & followers
// Followers -> avgFollows

//
function sendAPIreq(){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', 'https://api.scratch.mit.edu/users/' + username, true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            var response = xmlhttp.responseText;
            getIcon(response);
            getID(response);
            followers(response);
            getJoinDate(response);
        }
    };
}

function getIcon(response){
    var obj = JSON.parse(response);
    var src= 'https://cdn2.scratch.mit.edu/get_image/user/'+obj.id+'_60x60.png';
    console.log(src);
    document.getElementById('icon').src = src;
    document.getElementById('user').innerHTML =  "@" + obj.username+ "</a>";
}

function getID(response){
    var obj = JSON.parse(response);
    document.getElementById('id').innerHTML = obj.id;
}

function getJoinDate(response){
    var obj = JSON.parse(response);
    document.getElementById("joined").innerHTML = (obj.history.joined).substring(0, obj.history.joined.indexOf('T'));
}

function followers(responseforavg) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', 'https://scratch.mit.edu/users/' + username + '/followers/', true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            var response = xmlhttp.responseText;
            var find = response.search("<h2>");
            var followersnum = response.substring(find, find + 200).match(/\(([^)]+)\)/)[1];
            document.getElementById("followers").innerHTML = c(followersnum);
            avgFollows(followersnum,responseforavg);
        }
    };

}

function avgFollows(followersnum,response) {
    var obj = JSON.parse(response);
    var curDate = new Date();
    var date = (obj.history.joined).split("T")[0].split("-");
    var year = (curDate.getFullYear()) - (Number(date[0]));
    var month = Number(date[1]);
    var day = Number(date[2]);
    console.log(year);
    console.log(month);
    console.log(day);
    console.log(followersnum);
    console.log(followersnum / (year + (month / 12) + (day / 365)));
    var avgFollowsPerYear = (followersnum / (year + (month / 12) + (day / 365)));
    var avgFollowsPerMonth = avgFollowsPerYear / 12;
    var avgFollowsPerDay = avgFollowsPerMonth / 30.44;
    var avgFollowsPerHour = avgFollowsPerDay / 24;

    avgFollowsPerYear = avgFollowsPerYear.toFixed(0);
    avgFollowsPerMonth = avgFollowsPerMonth.toFixed(1);
    avgFollowsPerDay = avgFollowsPerDay.toFixed(1);
    avgFollowsPerHour = avgFollowsPerHour.toFixed(2);

    if (year < 1) {
        document.getElementById('avgFollowersYear').style.fontSize = "x-large";
        document.getElementById('avgFollowersYear').innerHTML = 'Error';
        if ((curDate.getUTCMonth() + 1) - month === 0) {
            document.getElementById('avgFollowersMonth').style.fontSize = "x-large";
            document.getElementById('avgFollowersMonth').innerHTML = 'Error';
            if (curDate.getUTCDate() == day) {
                document.getElementById('avgFollowersDay').style.fontSize = "x-large";
                document.getElementById('avgFollowersDay').innerHTML = 'Error';
                if (curDate.getUTCHours() == hour) {
                    document.getElementById('avgFollowersHour').style.fontSize = "x-large";
                    document.getElementById('avgFollowersDay').innerHTML = 'Error';
                } else {
                    document.getElementById('avgFollowersHour').innerHTML = avgFollowsPerHour;
                }
            } else {
                document.getElementById('avgFollowersHour').innerHTML = avgFollowsPerHour;
                document.getElementById('avgFollowersDay').innerHTML = avgFollowsPerDay;
            }
        } else if ((curDate.getUTCMonth() + 1) - month == 1) {
            if (curDate.getUTCDate() < day) {
                document.getElementById('avgFollowersMonth').style.fontSize = "x-large";
                document.getElementById('avgFollowersMonth').innerHTML = 'Error';
                document.getElementById('avgFollowersHour').innerHTML = avgFollowsPerHour;
                document.getElementById('avgFollowersDay').innerHTML = avgFollowsPerDay;
            } else {
                document.getElementById('avgFollowersHour').innerHTML = avgFollowsPerHour;
                document.getElementById('avgFollowersDay').innerHTML = avgFollowsPerDay;
                document.getElementById('avgFollowersMonth').innerHTML = avgFollowsPerMonth;
            }
        } else {
            document.getElementById('avgFollowersHour').innerHTML = avgFollowsPerHour;
            document.getElementById('avgFollowersDay').innerHTML = avgFollowsPerDay;
            document.getElementById('avgFollowersMonth').innerHTML = avgFollowsPerMonth;
        }
    } else {
        document.getElementById('avgFollowersYear').innerHTML = c(avgFollowsPerYear);
        document.getElementById('avgFollowersHour').innerHTML = avgFollowsPerHour;
        document.getElementById('avgFollowersDay').innerHTML = avgFollowsPerDay;
        document.getElementById('avgFollowersMonth').innerHTML = c(avgFollowsPerMonth);
    }
}
//

function following(followersnum) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', 'https://scratch.mit.edu/users/' + username + '/following/', true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            var response = xmlhttp.responseText;
            var find = response.search("<h2>");
            var following = response.substring(find, find + 200).match(/\(([^)]+)\)/)[1];
            document.getElementById("following").innerHTML = following;
        }
    };

}

function messageCount() {
    if (username.toLowerCase() !== "griffpatch"){
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('GET','https://api.scratch.mit.edu/users/'+username+'/messages/count',true);
        xmlhttp.send();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                var response = xmlhttp.responseText;
                var obj = JSON.parse(response);
                document.getElementById('messageCount').innerHTML = c(obj.count);
            }
        };
    }
    else {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('GET','https://api.scratch.mit.edu/proxy/users/griffpatch/activity/count?'+Math.floor(Date.now() / 1000),true);
        xmlhttp.send();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                var response = xmlhttp.responseText;
                var obj = JSON.parse(response);
                document.getElementById('messageCount').innerHTML = c(obj.msg_count);
            }
        };
    }
}

function activity() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', 'https://scratch.mit.edu/messages/ajax/user-activity/?user=' + username + '&max=1000000', true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            var responseactivity  = xmlhttp.responseText;
            var countloves = (responseactivity.match(/icon-xs black love/g) || []).length;
            document.getElementById("amtOfLovedProjects").innerHTML = c(countloves);
            /*var countshares = (responseactivity.match(/icon-xs black project/g) || []).length;
            document.getElementById("unsharedprojs").innerHTML = "Projects that were unshared: <b>" + String(countshares-totalProjects) + "</b> (BETA)";*/
        }};
}

var totalProjects = 0;
var offset = 0;
var totalViews = 0;
var totalLoves = 0;
var totalFaves = 0;
var totalComments = 0;
var mostViewedNum = -1;
var mostViewedLoves = -1;
var mostViewedFaves = -1;
var mostViewedComments = -1;
var mostViewedLikes = -1;
var mostLovedNum = -1;
var mostLovedViews = -1;
var mostLovedFaves = -1;
var mostLovedLikes = -1;
var mostLovedComments = -1;
var mostCommentedNum  = -1;
var mostCommentedViews = -1;
var mostCommentedLoves = -1;
var mostCommentedLikes = -1;
var mostComentedFaves = -1;
var mostLikedNum = -1;
var mostLikedViews = -1;
var mostLikedFaves = -1;
var mostLikedLoves = -1;
var mostLikedComments = -1;
function projectStats() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', 'https://api.scratch.mit.edu/users/' + username + "/projects?offset=" + offset, true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            var parsedJSON = JSON.parse(xmlhttp.responseText);

            if (parsedJSON.length === 0 & offset !== 0) {

            }

            var i = 0;
            while(i < parsedJSON.length) {
                // Views
                var totalViews = totalViews + Number(parsedJSON[i].stats.views);
                if (Number(parsedJSON[i].stats.views)>mostViewedNum) {
                    mostViewedID = parsedJSON[i].id;
                    mostViewedTitle = parsedJSON[i].title;
                    mostViewedNum = parsedJSON[i].stats.views;
                    mostViewedImg = parsedJSON[i].image;
                    mostViewedFaves = parsedJSON[i].stats.favorites;
                    mostViewedLoves = parsedJSON[i].stats.loves;
                    mostViewedComments = parsedJSON[i].stats.comments;
                    mostViewedLikes = mostViewedLoves/mostViewedNum;
                    mostViewedLikes = mostViewedLikes.toFixed(1);
                  }
                //
                // Loves
                totalLoves = totalLoves + Number(parsedJSON[i].stats.loves);
                if (Number(parsedJSON[i].stats.loves)>mostLovedNum) {
                    mostLovedID = parsedJSON[i].id;
                    mostLovedTitle = parsedJSON[i].title;
                    mostLovedNum = parsedJSON[i].stats.loves;
                    mostLovedImg = parsedJSON[i].image;
                    mostLovedFaves = parsedJSON[i].stats.favorites;
                    mostLovedViews = parsedJSON[i].stats.views;
                    mostLovedComments = parsedJSON[i].stats.comments;
                    mostLovedLikes = mostLovedNum/mostLovedViews;
                    mostLovedLikes = mostLovedLikes.toFixed(1);
                  }
                //
                // Faves
                totalFaves = totalFaves + Number(parsedJSON[i].stats.favorites);
                //
                // Comments
                totalComments = totalComments + Number(parsedJSON[i].stats.comments);
                if (Number(parsedJSON[i].stats.comments)>mostCommentedNum) {
                    mostCommentedID = parsedJSON[i].id;
                    mostCommentedTitle = parsedJSON[i].title;
                    mostCommentedNum = parsedJSON[i].stats.comments;
                    mostCommentedImg = parsedJSON[i].image;
                    mostCommentedFaves = parsedJSON[i].stats.favorites;
                    mostCommentedViews = parsedJSON[i].stats.views;
                    mostCommentedLoves = parsedJSON[i].stats.loves;
                    mostCommentedLikes = mostCommentedLoves/mostCommentedViews;
                    mostCommentedLikes = mostCommentedLikes.toFixed(1);
                  }
                //
                // Love-View ratio
                var ratio = Number(parsedJSON[i].stats.loves)/Number(parsedJSON[i].stats.views)*100;
                if (ratio>mostLikedNum) {
                    mostLikedID = parsedJSON[i].id;
                    mostLikedTitle = parsedJSON[i].title;
                    mostLikedNum = Number(parsedJSON[i].stats.loves)/Number(parsedJSON[i].stats.views)*100;
                    mostLikedNum = mostLikedNum.toFixed(1);
                    mostLikedImg = parsedJSON[i].image;
                    mostLikedFaves = parsedJSON[i].stats.favorites;
                    mostLikedViews = parsedJSON[i].stats.views;
                    mostLikedLoves = parsedJSON[i].stats.loves;
                    mostLikedComments = parsedJSON[i].stats.comments;
                  }
                //
                totalProjects++;
                i++;
            }

            if (parsedJSON.length === 20) {
                offset = offset+20;
                setTimeout(function(){projectStats(); }, 200);}
            else {
                showProjectStats();
            }
        }};
        document.getElementById("mostViewed").innerHTML = "<center><a href='https://scratch.mit.edu/projects/"+mostViewedID+"/' class='projTitle'>"+mostViewedTitle+"</a></center><table style='margin:0px;padding:0px;'><td style='margin:0px;padding:0px;'><img style='display:inline; width:132px;height:96px;'src='"+mostViewedImg+"'></img></td>&nbsp;<td style='margin:0px;padding:0px;'><ul class='statistics' style='top:0px;padding:0px;list-style-type:none;display:inline-block;font-size:15px;'><li class='statistics'>💖: "+mostViewedLoves+"</li><li class='statistics'>⭐: "+mostViewedFaves+"</li><li class='statistics'>💬: "+mostViewedComments+"</li><li class='statistics'>👁️: "+mostViewedNum+"</li><li class='statistics'>👍: "+mostViewedLikes+"%</li><li class='statistics'></li></ul></td></table>";
        document.getElementById("mostCommented").innerHTML = "<center><a href='https://scratch.mit.edu/projects/"+mostCommentedID+"/' class='projTitle'>"+mostCommentedTitle+"</a></center><table style='margin:0px;padding:0px;'><td style='margin:0px;padding:0px;'><img style='display:inline; width:132px;height:96px;'src='"+mostCommentedImg+"'></img></td>&nbsp;<td style='margin:0px;padding:0px;'><ul  class='statistics' style='top:0px;padding:0px;list-style-type:none;display:inline-block;font-size:15px;'><li class='statistics'>💖: "+mostCommentedLoves+"</li><li class='statistics'>⭐: "+mostCommentedFaves+"</li><li class='statistics'>💬: "+mostCommentedNum+"</li><li class='statistics'>👁️: "+mostCommentedViews+"</li><li class='statistics'>👍: "+mostCommentedLikes+"%</li><li class='statistics'></li></ul></td></table>";
        document.getElementById("mostLiked").innerHTML = "<center><a href='https://scratch.mit.edu/projects/"+mostLikedID+"/' class='projTitle'>"+mostLikedTitle+"</a></center><table style='margin:0px;padding:0px;'><td style='margin:0px;padding:0px;'><img style='display:inline; width:132px;height:96px;'src='"+mostLikedImg+"'></img></td>&nbsp;<td style='margin:0px;padding:0px;'><ul class='statistics' style='top:0px;padding:0px;list-style-type:none;display:inline-block;font-size:15px;'><li class='statistics'>💖: "+mostLikedLoves+"</li><li class='statistics'>⭐: "+mostLikedFaves+"</li><li class='statistics'>💬: "+mostLikedComments+"</li><li class='statistics'>👁️: "+mostLikedViews+"</li><li class='statistics'>👍: "+mostLikedNum+"%</li><li class='statistics'></li></ul></td></table>";

        document.getElementById("mostLoved").innerHTML = "<center><a href='https://scratch.mit.edu/projects/"+mostLovedID+"/' class='projTitle'>"+mostLovedTitle+"</a></center><table style='margin:0px;padding:0px;'><td style='margin:0px;padding:0px;'><img style='display:inline; width:132px;height:96px;'src='"+mostLovedImg+"'></img></td>&nbsp;<td style='margin:0px;padding:0px;'><ul class='statistics'style='top:0px;padding:0px;list-style-type:none;display:inline-block;font-size:15px;'><li class='statistics'>💖: "+mostLovedNum+"</li><li class='statistics'>⭐: "+mostLovedFaves+"</li><li class='statistics'>💬: "+mostLovedComments+"</li><li class='statistics'>👁️: "+mostLovedViews+"</li><li class='statistics'>👍: "+mostLovedLikes+"%</li><li class='statistics'></li></ul></td></table>";

}

function showProjectStats(){
    console.log(totalProjects);
    console.log(totalViews);
    console.log(totalLoves);
    console.log(totalFaves);
    console.log(totalComments);
    console.log(mostViewedNum);
    console.log(mostLovedNum);
    console.log(mostViewedNum);
    projectStats();
}


function c(x) { // Add comma
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
