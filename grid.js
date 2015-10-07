(function() {
	"use strict";

	$(document).ready(function() {
		initialize();
		$("[type=range]").change(initialize);
		$("button").click(generate);

	});

	function initialize() {
		$(".row").empty();

		output();

		var cols = $("[name=cols]").val()
		var gutter = $("[name=gutter]").val();
		var padding = $("[name=padding]").val();

		//1em arbitrarily 16px for this page.
		var gutterSize = gutter * 16;
		var paddingSize = padding * 16;


		//Calculate margins for gutter effect
		var totalWidth = $(".example").width();
		
		var totalMargin = (cols - 1) * gutterSize;
		
		/* Firefox and Chrome appear to round fractional pixels differently
			The one extra pixel there prevents the grid from breaking in Firefox
			and is (hopefully) barely noticable	 */ 
		var colWidth = ((totalWidth - totalMargin) - 1) / cols;


		//push divs to array to save on DOM touches
		var divs = [];
		for(var i = 0; i < cols; i++) {
			var div = "<div><div></div></div>";
			divs.push(div);
		}
		$(".row").append(divs.join(""));

		var outer = $(".row > div");
		var inner = $(".row > div > div");
		//give width, padding and margin
		outer.addClass("col-1").width(colWidth).css("marginRight", gutter + "em");
		outer.css("padding", padding + "em");

		if(inner.width() <= 0) {
			$(inner).width(0);
			$(".warning").show();
		} else {
			$(".warning").hide();
		}		
	}

	function output() {
		$(".output").each(function(index){

			var input = $(this).siblings("input");
			var output = input.val();

			//if padding or gutter
			if(input.attr("name") != "cols") {
				output += " em";
			}
			$(this).text(output);
		});
	}

	function selectText(element) {
	    var doc = document,
			text = doc.getElementById(element),
			range,
			selection;

		if (doc.body.createTextRange) { //ms
		    range = doc.body.createTextRange();
		    range.moveToElementText(text);
		    range.select();
		} else if (window.getSelection) { //all others
			selection = window.getSelection();        
			range = doc.createRange();
			range.selectNodeContents(text);
			selection.removeAllRanges();
			selection.addRange(range);
    	}
    }

	function generate() {
		var cols = $("[name=cols]").val()
		var gutter = $("[name=gutter]").val();
		var padding = $("[name=padding]").val();
		var url = "generate.php?cols=" + cols + "&gutters=" + gutter + "&pad=" + padding;

		$.ajax({
			url: url,

			type: "GET",

			dataType: "html",

			success: function(html) {
				$(".grid-code").empty().append(html);
				$(".grid-code-wrap").show();
				$(".usage-wrap").show();
				//slow scroll to results
				$('html, body').animate({
    				scrollTop: $(".grid-code-wrap").offset().top
				}, 1000);
				//allow one-click text selection
				$(".grid-code, .usage").click(function() {
					var select = $(this).find("code");
					select = select.attr("id");
					selectText(select);
				});

			},

			error: function() {
				alert("There was an error communicating with the server");
			}
		});
	}

})();