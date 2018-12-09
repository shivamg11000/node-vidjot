
$(function() {

    // collapsing cards or ideas
    $(".collapsing-btn").click(function(){
        $(this).parent().toggleClass("collapsed");
    });

    // show input in video section
    $(".addVideo").click(function(){
        $(this).next().toggleClass("active");
    });

    // add/embed youtube video
    $(".video-section input[type='text']").on('keyup', function (e) {
        if (e.keyCode == 13) {  // enter
            var containerEl = $(this).parent();
            var url = $(this).val();
            var id = extractYouTubeID(url);
            var embedUrl = embedUrlGen(id);
            embedVideo(containerEl, embedUrl);
            addVideoUrlToDB(containerEl.parent(), embedUrl);
        }
    });


});

function extractYouTubeID(youtubeUrl){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = youtubeUrl.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;    
}

function embedUrlGen(youtubeId){
    return `https://www.youtube.com/embed/${youtubeId}?showinfo=0`;
}


function embedVideo(reference, url){
    var _iframeEl = 
    `<iframe id="video"
      src=${url}
      frameborder="0" allowfullscreen>
    </iframe>`;

    reference.empty();
    reference.html(_iframeEl);
}

// add video url to corresponding idea in database
function addVideoUrlToDB(referenceEL, url){ 
    var _href = referenceEL.find("#edit-btn").attr("href");
    var ideaID = /[^/]*$/.exec(_href)[0];
    
    $.ajax({
        url: `/ideas/${ideaID}/video`,
        type: 'PUT',
        dataType: 'json',
        data: {url : url},
        success: function(res) {
            console.log(res);
        }
     });
}