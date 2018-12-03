
let POLL_PLAIN_TEXT = 0,POLL_PLAIN_IMAGE =1,POLL_TEXT_OPTIONS = 2,
POLL_PHOTO_OPTIONS=3,POLL_EMOJI_OPTIONS_PHOTO = 4,POLL_EMOJI_OPTIONS_VIDEO = 5,
POLL_PLAIN_VIDEO = 6,POLL_PHOTO_TEXT_OPTIONS = 7,POLL_EMOJI_OPTIONS = 8,POLL_VIDEO_TEXT_OPTIONS = 9,POLL_ADS =10,POLL_TRENDING = 11,POLL_PHOTO_STAR = 12,POLL_VIDEO_STAR = 13,POLL_STAR = 14,POLL_STATUS = 15;

var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

var placeholder = 'https://1080motion.com/wp-content/uploads/2018/06/NoImageFound.jpg.png';


Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};





function loadPosts(){
    var pollsRef = firebase.database().ref('polls/').orderByChild('date');
    var storage = firebase.storage().ref('images');
    var uid = localStorage.uid;

    pollsRef.on('child_added', function(data) {
        var poll = data.val();
        var type = poll.type;
        var options = poll.options;
        var comments = poll.comments;
        var time = new Date(poll.date).toLocaleDateString("en-US", options);
        var plainEmoji = (type == POLL_EMOJI_OPTIONS);
        var voted = (poll.votes && uid in poll.votes);

        
        var postCard = document.createElement('div');
        postCard.classList.add('post-card');
        postCard.classList.add('card');
        postCard.id = poll.id+'-card';


        var head = document.createElement('div');

            var postHead = '<div class="post-head">'
            postHead+= '<img id="'+poll.uid+'-poll-user-pic" />'
            postHead+= '<div class="post-header-items">'
            postHead+= '<span class="post-username">'+poll.username+'</span><br>'
            postHead+= '<span class="post-time">'+time+'</span>'
            postHead+= '</div>'
            postHead+= '</div>'
            postHead+= '<span class="post-caption">'+poll.text+'</span>'


            var postImage = '<div  class="post-image" >'
            postImage+= '<img id="'+poll.id+'-poll-main-pic"/>'
            postImage+= '</div>'


            var postImageOptions = '<div class="grid-images-sizer">'
            postImageOptions+= '<div class="grid-images">'

            if(type == POLL_PHOTO_OPTIONS){
                var arrayLength = options.length;
                var bigger = arrayLength<=2;
                for (var i = 0; i < arrayLength; i++) {
                    var option = options[i];
                    var image_id = poll.id+'/'+i+'/'+arrayLength;
                    var perc = calculatePercentage(poll.votes,i);
                    postImageOptions+= '<div id="'+poll.id+option.index+'-poll-option-pic" class="grid-image '+(bigger? 'bigger': '')+'">'
                    postImageOptions+= '<div class="selected"></div>'
                    postImageOptions+= '<div class="progressbar" id="'+poll.id+option.index+'-poll-option">'
                    postImageOptions+= '<div class="progressbar-progress" style="width:'+perc+'%;"></div>'
                    postImageOptions+= '<span class="progressbar-text">'+option.text+'</span>'
                    postImageOptions+= ' </div>'
                    postImageOptions+= '<div style="visibility:'+(voted? 'hidden':'visible')+';" id="'+image_id+'-vote-container" class="vote-container"><div class="vote-btn"><i id="'+image_id+'" '+(voted? '': 'onClick="onVote(this.id)"')+' class="fa fa-check-circle vote-icon"></i></div></div>'
                    postImageOptions+= ' </div>'
                }
            }

            postImageOptions+= '</div>'
            postImageOptions+= '</div>'


            var postStarOptions = '<div class="star-options">'
            postStarOptions+= '<form>'
            postStarOptions+= '<fieldset class="starability-growRotate">'
            postStarOptions+= '<input type="radio" id="rate5" name="rating" value="5" />'
            postStarOptions+= '<label for="rate5" title="Amazing">5 stars</label>'
            postStarOptions+= '<input type="radio" id="rate4" name="rating" value="4" />'
            postStarOptions+= '<label for="rate4" title="Very good">4 stars</label>'
            postStarOptions+= '<input type="radio" id="rate3" name="rating" value="3" />'
            postStarOptions+= '<label for="rate3" title="Average">3 stars</label>'
            postStarOptions+= '<input type="radio" id="rate2" name="rating" value="2" />'
            postStarOptions+= '<label for="rate2" title="Not good">2 stars</label>'
            postStarOptions+= '<input type="radio" id="rate1" name="rating" value="1" />'
            postStarOptions+= '<label for="rate1" title="Terrible">1 star</label>'
            postStarOptions+= '</fieldset>'
            postStarOptions+= '</form>'
            postStarOptions+= '</div>'


            var postEmojis = '<div class="emoji-options '+(plainEmoji? 'plain-emoji':'')+'">'
            postEmojis+= '<div id="'+poll.id+'/0/5" '+(voted? '': 'onClick="onVote(this.id)"')+' class="emoji-wrapper '+(voted? '': 'voteful')+'">'
            postEmojis+= '<div id="'+poll.id+'-emoji-1" class="circle-progress"></div>'
            postEmojis+= '<img  src="images/emoji3.png"/>'
            postEmojis+= '</div>'
            postEmojis+= '<div id="'+poll.id+'/1/5" '+(voted? '': 'onClick="onVote(this.id)"')+' class="emoji-wrapper '+(voted? '': 'voteful')+'">'
            postEmojis+= '<div id="'+poll.id+'-emoji-2" class="circle-progress"></div>'
            postEmojis+= '<img  src="images/puke.png"/>'
            postEmojis+= ' </div>'
            postEmojis+= '<div id="'+poll.id+'/2/5" '+(voted? '': 'onClick="onVote(this.id)"')+' class="emoji-wrapper '+(voted? '': 'voteful')+'">'
            postEmojis+= '<div id="'+poll.id+'-emoji-3" class="circle-progress"></div>'
            postEmojis+= '<img  src="images/love.png"/>'
            postEmojis+= '</div>'
            postEmojis+= '<div id="'+poll.id+'/3/5" '+(voted? '': 'onClick="onVote(this.id)"')+' class="emoji-wrapper '+(voted? '': 'voteful')+'">'
            postEmojis+= '<div id="'+poll.id+'-emoji-4" class="circle-progress"></div>'
            postEmojis+= '<img  src="images/emoji1.png"/>'
            postEmojis+= '</div>'
            postEmojis+= '<div id="'+poll.id+'/4/5" '+(voted? '': 'onClick="onVote(this.id)"')+' class="emoji-wrapper '+(voted? '': 'voteful')+'">'
            postEmojis+= '<div id="'+poll.id+'-emoji-5" class="circle-progress"></div>'
            postEmojis+= ' <img src="images/emoji5.png"/>'
            postEmojis+= '</div>'
            postEmojis+= '</div>'


            var postVideo = '<video class="post-video" width="320" height="240" controls>'
            postVideo += '<source src="'+poll.resource_url+'" type="video/mp4">'
            postVideo += '</video>'

            var postOptions = '<div class="post-options">'
            if(options){
                var arrayLength = options.length;
                var bigger = arrayLength<=2;
                for (var i = 0; i < arrayLength; i++) {
                    var option = options[i];
                    var image_id = poll.id+'/'+i+'/'+arrayLength;
                    var perc = calculatePercentage(poll.votes,i);
                    postOptions+= '<div class="progressbar '+(voted? '': 'voteful')+'" id="'+image_id+'"  '+(voted? '': 'onClick="onVote(this.id)"')+'>'
                    postOptions+= '<div class="progressbar-progress" style="width:'+perc+'%;"></div>'
                    postOptions+= '<span class="progressbar-text">'+option.text+'</span>'
                    postOptions+= ' </div>'
                }
            }
            

            postOptions+= '</div>'


            var postActions = '<div class="actions">'
            postActions+= '<span id="'+poll.id+'" onClick="showComments(this.id)" ><span class="fa fa-comments" style="margin-right:0.5em;"></span>  '+Object.size(comments)+' Comments</span>'
            postActions+= '<span style="flex:auto;"></span>'
            postActions+= '<span><span class="fa fa-share-alt" style="margin-right:0.5em;"></span>  Share Post</span>'
            postActions+= ' </div>'

            


            var finalText = postHead;
            switch(type){
                case POLL_PLAIN_TEXT:
                    finalText+=postActions;
                    break;
                case POLL_PLAIN_IMAGE:
                    finalText+=postImage;
                    finalText+=postActions;
                    break;
                case POLL_TEXT_OPTIONS:
                    finalText+=postOptions;
                    finalText+=postActions;
                    break;
                case POLL_STAR:
                    finalText+=postStarOptions;
                    finalText+=postActions;
                    break;
                case POLL_PHOTO_TEXT_OPTIONS:
                    finalText+=postImage;
                    finalText+=postOptions;
                    finalText+=postActions;
                    break;
                case POLL_PHOTO_STAR:
                    finalText+=postImage;
                    finalText+=postStarOptions;
                    finalText+=postActions;
                    break;
                case POLL_PLAIN_VIDEO:
                    finalText+=postVideo;
                    finalText+=postActions;
                    break;
                case POLL_VIDEO_STAR:
                    finalText+=postVideo;
                    finalText+=postStarOptions;
                    finalText+=postActions;
                    break;
                case POLL_PHOTO_OPTIONS:
                    finalText+=postImageOptions;
                    finalText+=postActions;
                    break;
                case POLL_VIDEO_TEXT_OPTIONS:
                    finalText+=postVideo;
                    finalText+=postOptions;
                    finalText+=postActions;
                    break;
                case POLL_EMOJI_OPTIONS_PHOTO:
                    finalText+=postImage;
                    finalText+=postEmojis;
                    finalText+=postActions;
                    break;
                case POLL_EMOJI_OPTIONS:
                    finalText+=postEmojis;
                    finalText+=postActions;
                    break;
                
                case POLL_EMOJI_OPTIONS_VIDEO:
                    finalText+=postVideo;
                    finalText+=postEmojis;
                    finalText+=postActions;
                    break;
                default:
                    finalText+=postActions;
            }

            head.innerHTML = finalText;
            postCard.appendChild(head);
            if(type != POLL_STATUS && poll.open){
                document.getElementById('list').appendChild(postCard);
            
                loadPhoto(poll.uid,poll.uid+'-poll-user-pic');
                switch(type){
                    case POLL_PLAIN_IMAGE:
                        loadPhoto(poll.id,poll.id+'-poll-main-pic',true);
                        break;
                    case POLL_PHOTO_OPTIONS:
    
                        var arrayLength = options.length;
                        for (var i = 0; i < arrayLength; i++) {
                            var option = options[i];
                            var image_id = poll.id+i;
                            var img = poll.id+option.index+'-poll-option-pic';
                            loadBackgroundPhoto(image_id,img,voted);
                        }
    
    
                        break;
                    case POLL_PHOTO_TEXT_OPTIONS:
                        loadPhoto(poll.id,poll.id+'-poll-main-pic',true);
                        break;
                    case POLL_PHOTO_STAR:
                        loadPhoto(poll.id,poll.id+'-poll-main-pic',true);
                        break;
                    case POLL_EMOJI_OPTIONS_PHOTO:
                        loadPhoto(poll.id,poll.id+'-poll-main-pic',true);
                        for (var i = 1; i <= 5; i++) {
                            var emoji_id = poll.id+'-emoji-'+i;
                            initCircleProgress(poll,emoji_id,i);
                        }
                        break;
                    case POLL_EMOJI_OPTIONS_VIDEO:
                        for (var i = 1; i <= 5; i++) {
                            var emoji_id = poll.id+'-emoji-'+i;
                            initCircleProgress(poll,emoji_id,i);
                        }
                        break;
                    case POLL_EMOJI_OPTIONS:
                        for (var i = 1; i <= 5; i++) {
                            var emoji_id = poll.id+'-emoji-'+i;
                            initCircleProgress(poll,emoji_id,i);
                        }
                        break;
                }
            }

            

      });
}

function calculatePercentage(_votes,_index){
    if(!_votes){
        return 0;
    }
    var count = 0;
    var total = Object.size(_votes);
    Object.keys(_votes).forEach(function(key) {
        var vote = _votes[key];
        if(vote == _index){
            count++;
        }
    });
    var perc = (count/total)*100;
    return perc;
}


function onVote(image_id){
    var uid = localStorage.uid;
    var items = image_id.split('/');
    var poll_id = items[0];
    var index = parseInt(items[1]);
    var length = parseInt(items[2]);
    console.log('Voting for: ',poll_id,index);
    firebase.database().ref('polls/').child(poll_id).child('votes').child(uid).set(index).then(()=>{
        try {
            var vc = document.getElementById(image_id+'-vote-container');
            if(vc)vc.style.visibility = 'hidden';
        } catch (error) {
            console.log('ERROR VOTING',error);
        }
    }).catch(function(error){
        console.log('ERROR VOTING',error);
    });
    document.getElementById(image_id).onclick = null;
    //Disable other votes
    try {
        for (var i = 0; i < length; i++) {
            var prev_id = poll_id+'/'+i+'/'+length;
            document.getElementById(prev_id).onclick = null;
            document.getElementById(prev_id).classList.remove('voteful');
            var vcc = document.getElementById(prev_id+'-vote-container');
            if(vcc)vcc.style.visibility = 'hidden';
        }
    } catch (error) {
        console.log('ERROR VOTING',error);
    }
}

function initCircleProgress(poll,id,index){
    var progress = calculatePercentage(poll.votes,index)
    var container = document.getElementById(id);
    var bar = new ProgressBar.Circle(container, {
        color: '#2BC86F',
        trailColor: '#fff',
        trailWidth: 0,
        duration: 1400,
        easing: 'bounce',
        strokeWidth: 10,
        from: {color: '#2BC86F', a:0},
        to: {color: '#27AE60', a:1},
        // Set default step function for all animate calls
        step: function(state, circle) {
        circle.path.setAttribute('stroke', state.color);
        }
    });
    
    bar.animate(progress/100); 
}

function showComments(id){
    var pollsRef = firebase.database().ref('polls').child(id).child('comments');
    var storage = firebase.storage().ref('images');
    
    document.getElementById('comments-list').innerHTML = ''

    pollsRef.on('child_added', function(data) {
        var comment = data.val();
        var time = new Date(comment.time).toLocaleDateString("en-US", options);
        

            var head = document.createElement('div');
            head.classList.add('comment');
            
            var commentTxt = '<img id="'+comment.uid+comment.id+'-comment-user-pic" class="avatar" />'
            commentTxt += ' <div class="comment-vert">'
            commentTxt+= '<span class="chat-username">'+comment.username+'</span><br>'
            commentTxt+= ' <span class="chat-msg" style="opacity:0.5;">'+time+'</span><br>'
            commentTxt+= '<span class="comment-text">'+comment.comment+'</span>'
            commentTxt+='</div>'
            commentTxt+='</div>'

            head.innerHTML = commentTxt;

            document.getElementById('comments-list').appendChild(head);
            document.getElementById('comments-modal').style.display='block';

            loadPhoto(comment.uid,comment.uid+comment.id+'-comment-user-pic');


        
    });
}

document.onload = function(){
    var modal = document.getElementById('modal01');
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    
    console.log(localStorage.uid);

}

function loadChats(){
    
    var uid = localStorage.uid;
    var userRef = firebase.database().ref('chats').child(localStorage.uid);
    userRef.on('child_added', function(data) {
        var chat = data.val();
        var time = new Date(chat.time).toLocaleDateString("en-US", options);
        

        var image_id = chat.id;
        if(chat.type == 0){
            if(uid === chat.uid_1){
                image_id = chat.uid_2;
            }else{
                image_id = chat.uid_1;
            }
        }

            
        var head = document.createElement('div');
        head.classList.add('chat-head');

        
        var hr = document.createElement('hr');
        
        var commentTxt = '<img id="'+chat.id+'-list" />'
        commentTxt += ' <div class="chat-header-items">'
        commentTxt+= '<span class="chat-username">'+chat.username+'</span><br>'
        commentTxt+= ' <span class="chat-msg">'+chat.message+'</span>'
        commentTxt+= '</div>'

        head.innerHTML = commentTxt;
        // postCard.appendChild(head);
        document.getElementById('chat-list').appendChild(head);
        document.getElementById('chat-list').appendChild(hr);

        loadPhoto(image_id,chat.id+'-list');

    });
}

function loadUser(_uid){
    var userRef = firebase.database().ref('users').child(_uid);
    loadPhoto(_uid,'profile-pic')
    userRef.on('value', function(data) {
        var user = data.val();
        document.getElementById('main-username').innerText = user.username;
        document.getElementById('about').innerText = user.about;
        document.getElementById('followers-count').innerText = Object.size(user.followers);
        document.getElementById('following-count').innerText = Object.size(user.following);
        console.log(user);
    });
}

function loadPhoto(_uid,_id,_clickable){
    var storage = firebase.storage().ref('images');
    return storage.child(_uid).getDownloadURL().then(function(url) {
        var img = document.getElementById(_id)
        img.src= url;
        img.style.opacity = '1';
        if(_clickable){
            img.onclick = function(){
                showModal(url);
            }
        }
        return url;
    }).catch(function(error) {
        document.getElementById(_id).src= placeholder;
        return placeholder;
    });
}


function loadBackgroundPhoto(_uid,_id,_clickable){
    var storage = firebase.storage().ref('images');
    return storage.child(_uid).getDownloadURL().then(function(url) {
        var img = document.getElementById(_id)
        img.style.backgroundImage= 'url('+url+')';
        if(_clickable){
            img.onclick = function(){
                showModal(url);
            }
        }
        return url;
    }).catch(function(error) {
        document.getElementById(_id).style.backgroundImage= 'url('+url+')';
        return placeholder;
    });
}


function signOut(){
    firebase.auth().signOut().then(function() {
        window.location.replace('../login.html');
        localStorage.clear();
        console.log('signed out');
      }).catch(function(error) {
        // An error happened.
      });
}



function checkLogin(){
    var uid = localStorage.getItem('uid');
    if(!uid){
        window.location.replace('login.html');
    }else{
        // loadUser(uid);
        // loadPosts();
        // loadChats();
    }
    console.log('checking login');

    

}

function closeModal(_id){
    document.getElementById(_id).style.display='none';
}

function showModal(_src){
    document.getElementById("modal-img").src= _src;
    document.getElementById('modal01').style.display='block';
}