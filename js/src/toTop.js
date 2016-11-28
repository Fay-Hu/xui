UCD.registerWidget('ToTop', function(SUPER) {
	var $win=$(window);
	
	return {
		options: {
			template: '<a class="to-top"><i class="icon icon-to-top"></i></a>',
			autohide: true,
			offset: 420,
			duration: 500,
			position: true,
			right: 20,
			bottom: 120
		},

		_create: function() {
			SUPER._create.call(this);
			
			var opts = this.options,
				$ele = this.element.hasClass('to-top') ? this.element : this.element = $(opts.template).appendTo('body');

			$ele.css({
				'cursor': 'pointer'
			});

			if (opts.autohide) {
				$ele.css('display', 'none');
			}

			if (opts.position) {
				$ele.css({
					'position': 'fixed',
					'right': opts.right,
					'bottom': opts.bottom,
				});
			}

			this._on({
				'click': '_handleClick'
			});
			
			var toggle = function(){
				var scrolling = $win.scrollTop();

				if (opts.autohide) {
					if (scrolling >= opts.offset) {
						$ele.fadeIn();
					} else $ele.fadeOut();
				}
			};
			
			
			$win.on('scroll.toTop',function() {
				toggle();
			});
			toggle();
		},

		_handleClick: function(e) {
			
			if($win.scrollTop() == 0){
				return ;
			}
			
			$('html,body').stop().animate({
				scrollTop: 0
			}, this.options.duration);
		},
		
		destroy:function(options){
			$win.off('.toTop');
			this.element.removeAttr('style');
			
			SUPER._destroy.call(this);			
		}
	};
});
