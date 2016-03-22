// TODOs-
// 1. Style the auto sliders to make them look more like bars than sliders, the left side is colored and the right side is the same as the background (i.e. invisible) and with only a small thumb (and the thumb should only be visible on hover probably)
//  - Then when a slider becomes locked, the max attribute for all other sliders has to get adjusted so it is impossible to slide past the maximum possible
//  - This will probably take a lot of css work to make sure that the widths of the underlying sliders stay proportional to each other
//  - You can style the track on each side by using a background-image gradient with set points, then a dark color to white. Then the points have to be reset as the slider is dragged



function sliderWithTotalBoxUpdate(slider) {
    var sliders = document.getElementsByClassName("slider_with_total_box_input");
    
    //console.log(slider);
    
    var sum = 0;
    for (i=0; i < sliders.length; i++){
        sum += parseInt(sliders[i].value);
    }
    
    
    var total_box = document.getElementsByClassName("slider_with_total_box_total_value")[0];
    var total_box_msg = document.getElementsByClassName("slider_with_total_box_msg")[0];
    
    total_box.innerHTML = sum;
    
    if (sum != 100) {
        total_box.style.color = "red";
        total_box_msg.innerHTML = "The total must be 100";
    }
    
    else {
        total_box.style.color = "#3960E7";
        total_box_msg.innerHTML = "Ok";
        slider.disabled = true;
        
        setTimeout(sliderWithTotalBoxUpdateReset(), 500);
    }
    
}

function sliderWithTotalBoxUpdateReset() {
    $('input').each(function(){
        if ($(this).attr('disabled')){
            $(this).removeAttr('disabled');
        }
            })
    
}

function lock(link) {
    
    var $currentSlider = $(link).parent().find('.slider-auto-reallocate-input');
    
    //$(link).parent().find('.slider-auto-reallocate-input').prop('disabled', true);
    //$(link).parent().find('.slider-auto-reallocate-input').addClass('locked');
    
    $currentSlider.prop('disabled', true);
    $currentSlider.addClass('locked');
    $(link).hide();
    $(link).siblings('.btn-success').show();
    
    var availableTotal = getAvailableTotal();
    
    $('.slider-auto-reallocate-input').not($currentSlider).not('.locked').each( function() {
        $(this).prop('max', availableTotal);
        $(this).css('width', availableTotal + '%');
        
        var val = $(this).val();
        var new_val = (val / availableTotal) * 100;
        var st = 'linear-gradient(to right, #3960E7 ' + new_val + '%, white ' + new_val + '%)';
        
        $(this).css('background', st);
        
        
        
    });
}

function unlock(link) {
    var $currentSlider = $(link).parent().find('.slider-auto-reallocate-input');
    $currentSlider.prop('disabled', false);
    $currentSlider.removeClass('locked');
    $(link).hide();
    $(link).siblings('.btn-danger').show();
    
    var availableTotal = getAvailableTotal();
    
    $('.slider-auto-reallocate-input').not('.locked').each( function() {
        $(this).prop('max', availableTotal);
        $(this).css('width', availableTotal + '%');
        
        var val = $(this).val();
        var new_val = (val / availableTotal) * 100;
        var st = 'linear-gradient(to right, #3960E7 ' + new_val + '%, white ' + new_val + '%)';
        $(this).css('background', st);
        
        
        
    });
    
}
    
    


function getAvailableTotal() {
    availableTotal = 100;
    $('.slider-auto-reallocate-input.locked').each(function () {
        availableTotal -= parseInt($(this).val());
        });
    
    return availableTotal;
}




$('.slider-auto-reallocate-input').each(function() {
    
    var init_value = parseInt($(this).text());

    //$(this).siblings('.value').text(init_value);
    
    
    $(this).on('input', function () {
        
        var $this = $(this);
        $this.trigger('change'); // A workaround to make the slider update with each move, before the cursor is released
        
        var unlocked = 0;
        $('.slider-auto-reallocate-input').each(function() {
           if ($(this).prop('disabled') == false){
                unlocked += 1
            } 
        });
    
        var unlocked_minus_one = unlocked - 1;
        
        
        
        if ($this.prop('disabled') == true) {
            return true;
        }
        
        var val = $this.val();
        var val_pct = (val - $this.attr("min")) / ($this.attr('max') - $this.attr('min')) * 100;
        
        if (val_pct < 0) {
            val_pct = 0;
        }
        
        //$this.css('background-image',
        //          '-webkit-gradient(linear, left top, right top, color-stop(0.5,#94A14E), color-stop(0.5, #FFFFFF))');
        
        
        // Adjust the css so the bar looks like it grows and shrinks
        var st = 'linear-gradient(to right, #3960E7 ' + val_pct + '%, white ' + val_pct + '%)';
        $this.css('background', st);
            
        
        
        //.siblings('.value').text(val);
        
        
        
        var total = 0;
        
        $('.slider-auto-reallocate-input').not($this).not('.locked').each(function () {
        
           total += parseInt($(this).val());
        });
        
        total += parseInt($this.val());
        
        var availableTotal = getAvailableTotal();
        
        var delta = availableTotal - total;
        
        //console.log(delta);
        
        
        $('.slider-auto-reallocate-input').not($this).not('.locked').each(function () {
           var value = parseInt($(this).val());
           var new_val = value + (delta/unlocked_minus_one);
           
           var val_pct = (new_val - $this.attr("min")) / ($this.attr('max') - $this.attr('min')) * 100;
           
           if (val_pct < 0) {
            val_pct = 0;
           }
           
           var st = 'linear-gradient(to right, #3960E7 ' + val_pct + '%, white ' + val_pct + '%)';
           $(this).css('background', st);
           
           //$(this).prop('max', availableTotal);
           //$(this).css('width', availableTotal + '%');
           
           if (new_val < 0 || $this.val() == 100) {
            new_val = 0;
           }
           if (new_val > 100) {
            new_val = 100;
           }
           
           $(this).val(new_val);
           //$(this).siblings('.value').text(new_val);
        });
        
        
        
        });


});

function equalize(group) {
    var options = $(group).parent().find('.option');
    
    var availableTotal = getAvailableTotal();
    var portion = availableTotal / options.not('.locked').length;
    
    $(options).not('.locked').each(function () {
        $(this).val(portion);
        var val_pct = (portion / availableTotal) * 100;
           
        if (val_pct < 0) {
         val_pct = 0;
        }
        
        var st = 'linear-gradient(to right, #3960E7 ' + val_pct + '%, white ' + val_pct + '%)';
        $(this).css('background', st);
        
        });
}






