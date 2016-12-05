(function(){
	var dragobj = null;
	var startx = 0;
	var starty = 0;
	var rect = $('stage').getClientRects()[0];
	var candle = $('candle');
	var candlepos = candle.getClientRects()[0];
	candlepos = {x: candlepos.left, y: candlepos.top };
	var shad = $('shad');

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
		startx = e.offsetX;
		starty = e.offsetY;

		dragobj = $('plate');
		dragobj.parentNode.removeChild( dragobj );
		dragobj.style.position = 'absolute';
		document.body.appendChild( dragobj );
		window.addEventListener('mousemove', mmove, false );
	}

	function mup( e ){
		dragobj = null;
		startx = 0;
		starty = 0;

		window.removeEventListener('mousemove', mmove, false );	
	}
	function mmove( e ){
		console.log( startx, starty );
		var vx = e.clientX-startx;
		var vy = e.clientY-starty;

		if( is_inside( vx+100, vy+100, rect ) ){
			var dist = distance( {x: vx, y: vy}, candlepos );
			var amt = Math.round( Math.min( 1, dist / 400 ) * 20 );
			var bamt = Math.round( Math.min( 1, dist / 400 ) * 10 );
			var ang = Math.atan2( vx-candlepos.x, vy-candlepos.y );

			var posx = ( Math.sin( ang ) * amt );
			var posy = ( Math.cos( ang ) * amt );
			console.log( posx );
			shad.style.webkitTransform = 'translate('+posx+'px,'+posy+'px)';
			if( dist < 100 ){
				shad.style.webkitFilter = 'blur(5px) hue-rotate(300deg)';
			} else {
				shad.style.webkitFilter = 'blur('+bamt+'px) brightness(0.2)';
			}
		}


		if( dragobj ){
			dragobj.style.left = vx+'px';
			dragobj.style.top = vy+'px';
		}		
	}

	window.onload = function(){
		$('plate').addEventListener('mousedown', mdown);
		window.addEventListener('mouseup', mup);
	}
	
})();