/**

Project: CheckTree jQuery Plugin
Version: 0.3 (porkchop)
Project	Website: http://jquery-checktree.googlecode.com/
Author:	JJ Geewax <jj@geewax.org>
License:
The	CheckTree jQuery plugin	is currently available for use in all personal or 
commercial projects	under both MIT and GPL licenses. This means	that you can choose	
the	license	that best suits	your project and use it	accordingly.

*/

;(function(jQuery) {

	jQuery.fn.checkTree	= function(settings) {
		
		settings = jQuery.extend({

			onExpand: null, 			//on
			onCollapse:	null, 			//off
			onCheck: null, 			//check
			onUnCheck: null, 			//after	check
			onHalfCheck: null, 			//HalfCheck
			onLabelHoverOver: null, 			//hover-over
			onLabelHoverOut: null, 			//hover-out
			labelAction: "expand",			//'expand(…ÏÀı)', 'check(checked)'
			debug: false			// Debug (“‘∑¿ÕÚ“ª)
		}, settings);

		var	$tree =	jQuery("ul.tree");	 //FInd Aim  we can also write: var $tree=jQuery("ul.tree")
		var	$lis = $tree.find('li');	//Find	all	the	li element
		var	$checkboxes	= $lis.find(":checkbox");	 //Find all the li	element	:checkbox


		// Hide	all	checkbox inputs
		$checkboxes.css('display', 'none');

		//Find all the li element does not contain the class. "Arrow"
		$lis.not(':has(.arrow)').each(function() {

			/* This	little piece here is by	far	the	slowest.   £®To	be studied£©
			arrow:Control treeview 
			checkbox:Control check
			*/

			jQuery(this).prepend('<div class="arrow"></div><div	class="checkbox"></div>');

		});



		/* Hide	all	sub-trees

			Speed:
			.attr("display",true)
			.css('display',	''), .css('display', 'none')
			.addClass(), .removeClass()
			.show(), .hide()
			.toggle()

		*/

		$tree.find('li > ul').css('display', 'none');



		/*

		What to	do when	the	arrow is clicked
		Aim: Find all .arrow node
		Speed:
		 - $lis.filter(':has(li)').find(' >	.arrow')
		 - $lis.filter(':has(li)').find('.arrow')
		 - $tree.find('li:has(li) .arrow')
		 - $tree.find('li:has(li) >	.arrow') <-	This was the fastest.

		*/



		$tree.find('li:has(li) > .arrow').click(function() {

			var	$this =	jQuery(this);

			$this.toggleClass('expanded')

			.toggleClass('collapsed')

			.siblings("ul:first")

			.toggle();



			// Handle callbacks
			if (settings.onExpand && $this.hasClass('expanded')) {

				settings.onExpand($this.parent());

			} else if (settings.onCollapse && $this.hasClass('collapsed')) {

				settings.onCollapse($this.parent());

			}

		}).addClass('collapsed');	//Add	style of "collapsed" defalut off


		/*
			What to	do when	the	checkbox is	clicked
		*/

		$tree.find('.checkbox').click(function() {



			var	$this =	jQuery(this);



			//Control small	.checkbox div
			$this.toggleClass('checked')

			.removeClass('half_checked') //This	is control select all's	style
			.siblings(':checkbox:first').attr('checked', $this.hasClass('checked') ? true :	false);	//jquery1.7	don't recognize	the	checked	= "checked"
			//Control select all
			$this.filter('.checked').siblings('ul:first').find('.checkbox:not(.checked)')

			.removeClass('half_checked')

			.addClass('checked')

			.siblings(':checkbox').attr('checked', true);



			//Control Clear	All
			$this.filter(':not(.checked)').siblings('ul:first').find('.checkbox.checked')

			.removeClass('checked half_checked')

			.siblings(':checkbox').attr('checked', false);



			// Send	a change event to our parent checkbox:


			$this.parents("ul:first").siblings(":checkbox:first").change();

			/*

				A select sibling elements, including their own methods

				var	k=$this.parent()

				//console.log(k.siblings().andSelf().find(":checkbox"))

			*/

			/*Control parent checkbox checked=true or false

				if($this.parents("ul:first").children().find("input[type='checkbox'][checked='checked']").length==0){

					$this.parents("ul:first").siblings(":checkbox:first").attr('checked', false);

				}

			*/

			// Handle callbacks
			if (settings.onCheck &&	$this.hasClass('checked')) {

				settings.onCheck($this.parent());

			} else if (settings.onUnCheck && $this.hasClass('checked') == false) {

				settings.onUnCheck($this.parent());

			}

		});



		/*
			What to	do when	a checkbox gets	a change event
			(Fired when	the	children of	this checkbox have changed)
		*/

		$checkboxes.change(function() {

			// If all the children are checked,	this should	be checked:
			var	$this =	jQuery(this);

			var	$checkbox =	$this.siblings('.checkbox:first'); //parent	checkbox node
			var	any_checked	= $this.siblings('ul:first').find(':checkbox:checked:first').length	== 1;

			var	any_unchecked =	$this.siblings('ul:first').find(':checkbox:not(:checked):first').length	== 1;



			if (any_checked) {

				$this.attr('checked', true);

				if (any_unchecked) {

					//smal check !(select All)
					$checkbox.addClass('half_checked')

					.removeClass('checked');

					if (settings.onHalfCheck) {

						settings.onHalfCheck($this.parent()); //Learning the callback function parameter assignment
					}

				} else { //smal	check select All
					$checkbox.addClass('checked')

					.removeClass('half_checked');
				}

			} else {

				$checkbox.removeClass('checked half_checked');

				$this.attr('checked', false);

			}

		});



		/*
			What to	do when	a label	is hovered or clicked
		*/

		$tree.find('label').click(function() {

			switch (settings.labelAction) {

			case 'expand':

				jQuery(this).siblings('.arrow:first').click();

				break;

			case 'check':

				jQuery(this).siblings('.checkbox:first').click();

				break;

			}

		})

		.hover(

			function() {

				jQuery(this).addClass("hover");

				if (settings.onLabelHoverOver) {

					settings.onLabelHoverOver(jQuery(this).parent());

				}

			},

			function() {

				jQuery(this).removeClass("hover");

				if (settings.onLabelHoverOut) {

					settings.onLabelHoverOut(jQuery(this).parent());

				}

			}

		);



		/*
			Extra convenience methods
		*/

		$tree.clear	= function() {

			$tree.find('.checkbox')
			.removeClass('checked half_checked')
			.siblings(':checkbox').attr('checked', false);

		};



	};

})(jQuery);