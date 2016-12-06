(function(){
	var dragobj = null;
	var startx = 0;
	var starty = 0;
	var rect = $('stage').getClientRects()[0];
	var candle = $('candle');
	var graph = $('graph');
	var candlepos = candle.getClientRects()[0];
	candlepos = {x: candlepos.left, y: candlepos.top };
	var shad = $('shad');
	var looping = false;
	var last = 0;
	var counter = 0;
	var plussing = 0;
	var bamt = 0;
	var amt = 0;
	var ang = 0;

	var Input = {
		mobile: !!('ontouchstart' in window),
		getX: function( e ){
			return (Input.mobile)? e.changedTouches[0].clientX : e.clientX;
		},
		getY: function( e ){
			return (Input.mobile)? e.changedTouches[0].clientY : e.clientY;
		},
		offsetX: function( e ){
			return (Input.mobile)? e.changedTouches[0].pageX-e.target.getClientRects()[0].left : e.offsetX;
		},
		offsetY: function( e ){
			return (Input.mobile)? e.changedTouches[0].pageY-e.target.getClientRects()[0].top : e.offsetY;
		}
	}
	Input.down = (Input.mobile? 'touchstart' : 'mousedown');
	Input.up = (Input.mobile? 'touchend' : 'mouseup');
	Input.move = (Input.mobile? 'touchmove' : 'mousemove');

	function is_inside( x,y, rect ){
		return ( (x >= rect.left) && (x<=rect.right) && (y>=rect.top) && (y<=rect.bottom) );
	}
	function distance( a, b ){
		if(!b.x) b.x=0; 
		if(!b.y) b.y=0;
		return Math.sqrt((b.x-a.x)*(b.x-a.x)+(b.y-a.y)*(b.y-a.y)); 
	}

	function $(sel){
		return document.getElementById( sel );
	}

	function mdown( e ){
		dragobj = $('plate');
		var pos = dragobj.getClientRects()[0];
		startx = Input.offsetX( e );
		starty = Input.offsetY( e );

		window.requestAnimationFrame( function(){
			dragobj.parentNode.removeChild( dragobj );
			document.body.appendChild( dragobj );
		});
		dragobj.style.position = 'absolute';
		if( dragobj.parentNode != document.body ){
			window.requestAnimationFrame( function(){
				dragobj.style.left = parseInt( pos.left)+'px';
				dragobj.style.top = parseInt( pos.top )+'px';	
			});			
		}
		window.addEventListener( Input.move, mmove, false );

		e.preventDefault();
	}

	function mup( e ){
		if( dragobj ){
			var vx = Input.getX( e )-startx;
			var vy = Input.getY( e )-starty;

			if( is_inside( vx+100, vy+100, rect ) ){
				dragobj.parentNode.removeChild( dragobj );

				$('stage').appendChild( dragobj );
				dragobj.style.left = vx - rect.left+'px';
				dragobj.style.top = vy - rect.top+'px';
			}
			dragobj = null;
			startx = 0;
			starty = 0;

			window.removeEventListener( Input.move, mmove, false );	
		}		
	}
	function mmove( e ){
		//console.log( startx, starty );
		var vx = Input.getX( e )-startx;
		var vy = Input.getY( e )-starty;

		if( is_inside( vx+100, vy+100, rect ) ){
			requestAnimationFrame( function(){
				candle.style.display = 'none';
				candle.style.display = 'block';
				looping = true;
				counter = 0;
			});
			

			var dist = distance( {x: vx, y: vy}, candlepos );
			amt = Math.round( Math.min( 1, dist / 400 ) * 20 );
			bamt = Math.round( Math.min( 1, dist / 400 ) * 10 );
			ang = Math.atan2( vx-candlepos.x, vy-candlepos.y );

			var posx = ( Math.sin( ang ) * amt );
			var posy = ( Math.cos( ang ) * amt );
			//console.log( posx );
			shad.style.webkitTransform = 'translate('+posx+'px,'+posy+'px)';
			if( dist < 90 ){
				shad.style.webkitFilter = 'blur(5px) hue-rotate(300deg)';
				graph.style.webkitFilter = 'blur(1px) hue-rotate(330deg) contrast(2.3)';
			} else {
				shad.style.webkitFilter = 'blur('+bamt+'px) brightness(0.2)';
				graph.style.webkitFilter = '';
			}
		} else {
			shad.style.webkitTransform = '';
			shad.style.webkitFilter = '';
			graph.style.webkitFilter = '';
		}


		if( dragobj ){
			window.requestAnimationFrame( function(){
				if( dragobj ){
					dragobj.style.left = vx+'px';
					dragobj.style.top = vy+'px';	
				}				
			});			
		}		
	}

	function loop( tm ){
		if( (tm-last) > 25 ){
			last = tm;
			frame();
		}
		requestAnimationFrame(loop);
	}
	function frame(){
		if( looping ){
			counter++;
			if( counter > 25 ){
				counter = 0;
			}

			plussing = (counter>16)? 1-( (counter-16)/9 ) : (counter/16);
			
			requestAnimationFrame(function(){
				var a = amt + (plussing*4);
				var posx = ( Math.sin( ang ) * a );
				var posy = ( Math.cos( ang ) * a );
				shad.style.webkitTransform = 'translate('+posx+'px,'+posy+'px)';
				shad.style.webkitFilter = 'blur('+(bamt-(plussing*0.5) )+'px) brightness(0.2)';
			});
		}
		
		//console.log( counter );
	}

	window.onload = function(){
		$('plate').addEventListener( Input.down, mdown);
		window.addEventListener( Input.up, mup);

		requestAnimationFrame( loop );
	}
	
})();