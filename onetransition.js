/*
 *  TODO: 
 *  - move transition definitions to options
 *  - test with diff versions of jq
 *  - github
 *  - blog
 *
 */

( function ( $ ) {
	$.fn.oneTransition = function ( options ) {
		var opts = $.extend( {}, $.fn.oneTransition.defaults, options );
		
		this.each( function () {
			var props = [],
				done = 0,
				current = 0,
				next,
				trans;
				ie = ("v" == "\v");
			var cont = $( this ),
				imgs = {};
			imgs.items = cont.find( 'img' );
			imgs.w = imgs.items.width();
			imgs.h = imgs.items.height();
			
			
			var make = function ( i ) {
				var fade = true;
				if ( trans == 'random' ) {
					var x = Math.ceil( Math.random() * imgs.w ),
						y = Math.ceil( Math.random() * imgs.h ),
						d = opts.delay * i;
				} else if ( trans == 'dotdotdot' ) {
					var x = Math.ceil( i * imgs.w / ( opts.maxCircles - 1 ) ),
						y = Math.ceil( imgs.h / 2 ),
						d = opts.delay * i;
				} else if ( trans == 'ripples' ) {
					var x = Math.ceil( imgs.w / 2 ),
						y = Math.ceil( imgs.h / 2 ),
						d = opts.delay * i * 1.5;
				} else if ( trans == 'single' ) {
					if ( i > 0 ) return;
					var x = Math.ceil( imgs.w / 2 ),
						y = Math.ceil( imgs.h / 2 ),
						d = 0,
						fade = false;
				} else if ( trans == 'corners' ) {
					var d = 0;
					if ( i == 0 ) {
						var x = imgs.w,
							y = 0;
					} else if ( i == 1 ) {
						var x = imgs.w,
							y = imgs.h;
					} else if ( i == 2 ) {
						var x = 0,
							y = imgs.h;
					} else if ( i == 3 ) {
						var x = 0,
							y = 0;
					} else {
						return;
					}
						
				}
				var circ = $( '<div class="prop" />' )
					.css({
						position: 'absolute',
						top: y,
						left: x,
						width: '0px',
						height: '0px',
						background: 'url(' + next.attr( 'src' ) + ') -' + x + 'px -' + y + 'px no-repeat',
						opacity: fade ? 0.25 : 1
					})
					.appendTo( cont )
					.delay( d )
					.animate({
						width: imgs.w * 2,
						height: imgs.w * 2,
						opacity: 1
						}, {
						duration: opts.duration - ( opts.maxCircles - 1 ) * opts.delay,
						step: function (a, b) {
							if ( b.prop == 'width') {
								$( this ).css({
									top: ( y - imgs.w * b.pos ),
									left: ( x - imgs.w * b.pos ),
									'background-position': ( - x + imgs.w * b.pos ) + 'px ' + ( - y + imgs.w * b.pos ) + 'px',
									'-moz-border-radius' : Math.ceil( imgs.w * b.pos ) + 'px',
									'-webkit-border-radius' : Math.ceil( imgs.w * b.pos ) + 'px',
									'border-radius' : Math.ceil( imgs.w * b.pos ) + 'px'
								});
							}
						},
						complete: function () {
							done ++;
							if ( props.length == done ) {
								next.show();
								cont.find( 'img:eq(' + current + ')' ).hide()
									.end()
									.find('.prop')
									.remove();
							
								current = ( current == imgs.items.length - 1 ) ? 0 : current + 1;
								done = 0;
								props = [];
								if ( opts.pause ) setTimeout( play, opts.pause );
							}
						}
					});
				props.push( circ );
			};
			
			var play = function () {
				var rnd = Math.floor( Math.random() * opts.transitions.length );
				trans = opts.transitions[rnd];
				
				cont
					.find('img:eq(' + current + ')').show()
					.siblings().hide();
				
				var n = ( current == imgs.items.length - 1 ) ? 0 : current + 1;
				next = cont.find('img:eq(' + n + ')' );
				for (var i = 0; i < opts.maxCircles; i++) {
						make( i );							
				}
			}
			
			if ( opts.pause ) setTimeout( play, opts.pause );
		});
	};
	
	$.fn.oneTransition.defaults = {
		maxCircles: 4,
		pause: 2500,
		delay: 130,
		duration: 2500,
		transitions: ['random', 'dotdotdot', 'ripples', 'corners', 'single']
	};
}) ( jQuery );