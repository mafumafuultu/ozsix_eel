import eel
eel.init('web')

web_options = {
	'mode': 'chrome-app',
	'host': 'localhost',
	'port': 9000,
	'chromeFlags': ["--window-size=1280,720"]
}

eel.start('index.html', options=web_options, size={'width':1280,'height':720})