if(top != self) { window.open(self.location.href, '_top') }

var currentNavItem = '';
$(window).scroll(function()
{
	var scroll = $(this).scrollTop() + 1;
	if( $('#changelog').length && (scroll > $('#changelog').offset().top) )
	{
		$('#main-nav a[href="#changelog"]').addClass('active').siblings().removeClass('active');
		return false;
	}
	else if( $('#testimonials').length && (scroll > $('#testimonials').offset().top) )
	{
		$('#main-nav a[href="#testimonials"]').addClass('active').siblings().removeClass('active');
		return false;		
	}
	else if( $('#preview').length && (scroll > $('#preview').offset().top) )
	{
		$('#main-nav a[href="#preview"]').addClass('active').siblings().removeClass('active');
		return false;		
	}
	else if( $('#features').length && (scroll > $('#features').offset().top) )
	{
		$('#main-nav a[href="#features"]').addClass('active').siblings().removeClass('active');
		return false;		
	}
	else
	{
		$('#main-nav a[href="#overview"]').addClass('active').siblings().removeClass('active');
		return false;		
	}
});

$(function()
{	
	$(document).on('click', 'a', function()
	{
		href = $(this).attr('href');
		if( href.substr(0, 1) == '#' )
		{
			$('html, body').animate({scrollTop: $($(this).attr('href')).offset().top});
			return false;
		}
	});
});