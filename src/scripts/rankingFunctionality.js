Question.prototype.setupDragAndDrop = function (){
    //debugger;
    // item_height=$(".item").outerHeight(true);
    // height=(item_height+2)*($(".item").length+1);
    // $(".source-container").height(height);
    
    let item = $(".item");
    //debugger;
    
    $(".source .item").draggable({
      revert:"invalid",
      start:function(){
        //debugger;
        $(this).data("index",$(this).parent().index());
        
      }
    });
    
    $(".source").droppable({
        drop:function(evern,ui){
            //debugger;
            if($(this).has(".item").length){
               ui.draggable.css({left:"0",top:"0"}).appendTo($(this));
                index=ui.draggable.data("index");
                $(this).find(".item").eq(0).appendTo($(".source").eq(index))
            }
            else{
                ui.draggable.css({left:"1px",top:"1px"});
                ui.draggable.appendTo($(this));
                $(".source").removeClass("ui-droppable-active");
            }
        }
    });
}