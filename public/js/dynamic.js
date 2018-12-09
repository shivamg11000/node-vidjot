
$(function() {

    // collapsing cards 
    $(".collapsing-btn").click(function(){
        $(this).parent().toggleClass("collapsed");
    });

    // show input in video section
    $(".addVideo").click(function(){
        $(this).next().toggleClass("active");
    });

    // add youtube video
    $(".video-section input[type='text']").on('keyup', function (e) {
        if (e.keyCode == 13) {  // enter
            containerEl = $(this).parent();
            url = $(this).val();
            id = extractYouTubeID(url);
            containerEl.empty();
            embedVideo(containerEl, id);
        }
    });

});

function extractYouTubeID(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;    
}

function embedVideo(reference, id){
    tmp = 
    `<iframe id="video"
      src="https://www.youtube.com/embed/${id}?showinfo=0"
      frameborder="0" allowfullscreen>
    </iframe>`;
    $(reference).html(tmp);
}