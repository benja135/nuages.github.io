/*
 * Date de dernière modification : 24/09/2018
 * Auteurs : LACHERAY Benjamin
 */

/* Constantes */

	const FPS = 40;
	const vitesseCreation = 30;


/* Variables */
	
	var canvas = document.getElementById("monCanvas");		// Récupère le canvas puis le contexte
	var ctx = canvas.getContext('2d');
	canvas.width = window.innerWidth-14;
	canvas.height = window.innerHeight-14;


	var mesBilles = [];					// Tableau de "Bille"
	var souris = {};
		souris.x = 0;
		souris.y = 0;

	var score = 0;


	var refreshWin = setInterval(draw, 1000/FPS);
	var createBall = setInterval(createNewBille, 1000/vitesseCreation);

	window.onpagehide  = function() {	// Quand l'user quitte la page en cliquant sur un lien
		if (window.refreshWin && window.createBall) {
			clearInterval(refreshWin);
			clearInterval(createBall);
		}
	};	
	window.onblur = function() {		// Event onblur : quand la page perd le focus
		if (window.refreshWin && window.createBall)  {
			clearInterval(refreshWin);
			clearInterval(createBall);
		}
	};	
	window.onfocus = function() {
		refreshWin = setInterval(draw, 1000/FPS);		// Lance la fonction draw toutes les (1000/FPS) ms
		createBall = setInterval(createNewBille, 1000/vitesseCreation);
	};

/* Callbacks */
function majCoorSouris(event) {
	souris.x = event.clientX - canvas.offsetLeft;
	souris.y = event.clientY - canvas.offsetTop;
}

/* "Classes" */

	function Nuage(px,py) {
		this.x = px;
		this.y = py;
		this.boules = [];
		this.nbBoules = Math.floor(getRandomValue(3,8));
		this.couleur = getNuanceDeGris();

		for (var i=0; i<this.nbBoules; i++) {
			if (i==0) {
				this.boules[0] = new Boule(this.x, this.y, Math.floor(getRandomValue(20,70)));
			} else {
				var taille = Math.floor(getRandomValue(20,70));
				var selectedBoule = Math.floor(getRandomValue(0,this.boules.length));
				var x = this.boules[selectedBoule].x-this.boules[selectedBoule].taille + Math.floor(getRandomValue(0,this.boules[selectedBoule].taille*2));
				while (x + taille < this.boules[selectedBoule].x+this.boules[selectedBoule].taille && x - taille > this.boules[selectedBoule].x-this.boules[selectedBoule].taille) {
					x = this.boules[selectedBoule].x-this.boules[selectedBoule].taille + Math.floor(getRandomValue(0,this.boules[selectedBoule].taille*2));
				}
				var y = this.boules[selectedBoule].y-this.boules[selectedBoule].taille + Math.floor(getRandomValue(0,this.boules[selectedBoule].taille*2));
				while (y + taille < this.boules[selectedBoule].y+this.boules[selectedBoule].taille && y - taille > this.boules[selectedBoule].y-this.boules[selectedBoule].taille) {
					y = this.boules[selectedBoule].y-this.boules[selectedBoule].taille + Math.floor(getRandomValue(0,this.boules[selectedBoule].taille*2));
				}
				this.boules.push(new Boule(x,y,taille));
			}
			this.boules[i].couleur = this.couleur;
		}

		this.draw = function() {

			for (var i=0; i<this.nbBoules; i++) {
				this.boules[i].drawContour();
			}
			for (var i=0; i<this.nbBoules; i++) {
				this.boules[i].draw();
			}

			this.move();

		}

		this.move = function() {
			for (var i=0; i<this.nbBoules; i++) {
				if (this.boules[i].sens == 1) {
					if (this.boules[i].taille < this.boules[i].firstTaille+this.boules[i].firstTaille/3) {
						this.boules[i].taille += this.boules[i].sens/20;
					} else {
						this.boules[i].sens *= -1;
					}
				} else {
					if (this.boules[i].taille > this.boules[i].firstTaille-this.boules[i].firstTaille/3) {
						this.boules[i].taille += this.boules[i].sens/20;
					} else {
						this.boules[i].sens *= -1;
					}
				}
				this.boules[i].x += 0.2;
			}
		}
	}

	function Boule(x, y, taille) {
		this.taille = taille;
		this.x = x;
		this.y = y;
		this.couleur = "white";
		this.sens = 1;
		if (Math.floor(getRandomValue(0,2)) == 1) {
			this.sens = -1;
		}
		this.firstTaille = this.taille;

		this.draw = function() {
			ctx.fillStyle = this.couleur;
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.taille, 0, Math.PI*2);
			ctx.fill();
		}

		this.drawContour = function() {
			ctx.strokeStyle = "black";
			ctx.lineWidth = 5;
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.taille, 0, Math.PI*2);
			ctx.stroke();
			ctx.closePath();
		}
	}


	function Bille() {
		this.taille = getRandomValue(0.1,5);
		this.vitesse = getRandomValue(1,10);
		this.x = canvas.width/100 * getRandomValue(1,100);
		this.y = 0 - this.taille;
		this.couleur = "white";

		this.draw = function() {
		
			ctx.fillStyle = this.couleur;
			//ctx.beginPath();
			//ctx.arc(this.x, this.y, this.taille, 0, Math.PI*2);
			//ctx.fill();
			ctx.fillRect(this.x-this.taille, this.y-this.taille, 1, this.taille*2);

			if (souris.x > this.x-this.taille && souris.x < this.x+this.taille && souris.y > this.y-this.taille && souris.y < this.y+this.taille) {
				for (i=0; i<2; i++) {
					var bille = new Bille();
					bille.taille = this.taille/2;
					bille.couleur = this.couleur;
					bille.y = this.y;
					if (i == 0) {
						bille.x = this.x-this.taille/2;
					} else {
						bille.x = this.x+this.taille/2;
					}
					mesBilles.push(bille);
				}
				score++;
				return false;
			}
	
			// Déplacements
			this.y += this.vitesse;

			return this.y-this.taille < canvas.height;
		}
	}


/* Fonctions */

	// Renvoie un nombre aléatoire entre min (inclus) et max (exclus)
	function getRandomValue(min, max) {
		return Math.random() * (max - min) + min;
	}

	function getRandomColor() {
		return '#' + Math.random().toString(16).substr(-6);
	}

	// Renvoie une couleur aléatoire pas trop foncée
	function getRandomColor2() {
		var r = 0;
		var g = 0;
		var b = 0;

		while (r + g + b < 150) {
			r = Math.floor(getRandomValue(0,256));
			g = Math.floor(getRandomValue(0,256));
			b = Math.floor(getRandomValue(0,256));
		}
		return "rgb(" + r + "," + g + "," + b + ")";
	}

	// Renvoie une nuance de vert
	function getNuanceDeVert() {
		var r = 0;
		var g = 0;
		var b = 0;

		while (r + g + b < 150 || g < r + b) {
			r = Math.floor(getRandomValue(0,256));
			g = Math.floor(getRandomValue(0,256));
			b = Math.floor(getRandomValue(0,256));
		}
		return "rgb(" + r + "," + g + "," + b + ")";
	}

	// Renvoie une nuance de gris
	function getNuanceDeGris() {
		var r = 0;

		while (r < 150) {
			r = Math.floor(getRandomValue(0,256));
		}

		return "rgb(" + r + "," + r + "," + r + ")";
	}

	// Fonction qui ajoute une bille (sera appelée via un timer)
	function createNewBille() {	
		mesBilles.push(new Bille());
	}


	var mesNuages = [];
	for (var i=0; i<10; i++) {
		mesNuages.push(new Nuage(Math.floor(getRandomValue(0,canvas.width)),Math.floor(getRandomValue(0,canvas.height))));
	}

	function draw() {

		/* Dessine le fond */
		canvas.width = window.innerWidth-14;
		canvas.height = window.innerHeight-14;
		//ctx.fillStyle = 'rgb(119, 181, 254)';
		//ctx.fillRect(0, 0, canvas.width, canvas.height);


		/* Dessine les billes, supprime si nécessaire */
		var i = 0;
		while (i < mesBilles.length) {
			if (!mesBilles[i].draw()) {
				delete mesBilles[i];
				mesBilles.splice(i, 1);		// Enlève l'élément i du tableau
			} else {
				i++;
			}
		}

		/* Dessine le texte */
		/*ctx.font = "28px Calibri, Geneva, Arial";
		ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
		ctx.textAlign = "center";
		ctx.fillText("Bienvenue sur ce merveilleux site de boules.", canvas.width/2, canvas.height/2);
		ctx.fillText("Boules explosées : " + score, canvas.width/2, canvas.height/2+32);

		if (score > 1000 && score < 1100) {
			ctx.fillStyle = getRandomColor();
			ctx.fillText("OMG ! Plus de 1000 boules explosées !", canvas.width/2, canvas.height/2+80);
		} else if (score > 2000 && score < 2100) {
			ctx.fillStyle = getRandomColor();
			ctx.fillText("Vous êtes un fanatique des boules !", canvas.width/2, canvas.height/2+80);
		}*/

		for (var i=0; i<4; i++) {
			mesNuages[i].draw();
		}

	}


/*=============================================================================*/  
/* Canvas Lightning v1
/*=============================================================================*/
var canvasLightning = function(c, cw, ch){
  
/*=============================================================================*/  
/* Initialize
/*=============================================================================*/
  this.init = function(){
    this.loop();
  };    
  
/*=============================================================================*/  
/* Variables
/*=============================================================================*/
  var _this = this;
  this.c = c;
  this.ctx = c.getContext('2d');
  this.cw = cw;
  this.ch = ch;
  this.mx = 0;
  this.my = 0;
  
  this.lightning = [];
  this.lightTimeCurrent = 0;
  this.lightTimeTotal = 50;
  
/*=============================================================================*/  
/* Utility Functions
/*=============================================================================*/        
this.rand = function(rMi, rMa){return ~~((Math.random()*(rMa-rMi+1))+rMi);};
this.hitTest = function(x1, y1, w1, h1, x2, y2, w2, h2){return !(x1 + w1 < x2 || x2 + w2 < x1 || y1 + h1 < y2 || y2 + h2 < y1);};
  
/*=============================================================================*/	
/* Create Lightning
/*=============================================================================*/
  this.createL= function(x, y, canSpawn){					
    this.lightning.push({
      x: x,
      y: y,
      xRange: this.rand(5, 30),
      yRange: this.rand(5, 25),
      path: [{
        x: x,
        y: y	
      }],
      pathLimit: this.rand(10, 35),
      canSpawn: canSpawn,
      hasFired: false
    });
  };
  
/*=============================================================================*/	
/* Update Lightning
/*=============================================================================*/
  this.updateL = function(){
    var i = this.lightning.length;
    while(i--){
      var light = this.lightning[i];						
      
      
      light.path.push({
        x: light.path[light.path.length-1].x + (this.rand(0, light.xRange)-(light.xRange/2)),
        y: light.path[light.path.length-1].y + (this.rand(0, light.yRange))
      });
      
      if(light.path.length > light.pathLimit){
        this.lightning.splice(i, 1)
      }
      light.hasFired = true;
    };
  };
  
/*=============================================================================*/	
/* Render Lightning
/*=============================================================================*/
  this.renderL = function(){
    var i = this.lightning.length;
    while(i--){
      var light = this.lightning[i];
      
      this.ctx.strokeStyle = 'hsla(60, 100%, 50%, '+this.rand(10, 100)/100+')';
      this.ctx.lineWidth = 1;
      if(this.rand(0, 30) == 0){
        this.ctx.lineWidth = 2;	
      }
      if(this.rand(0, 60) == 0){
        this.ctx.lineWidth = 3;	
      }
      if(this.rand(0, 90) == 0){
        this.ctx.lineWidth = 4;	
      }
      if(this.rand(0, 120) == 0){
        this.ctx.lineWidth = 5;	
      }
      if(this.rand(0, 150) == 0){
        this.ctx.lineWidth = 6;	
      }	
      
      this.ctx.beginPath();
      
      var pathCount = light.path.length;
      this.ctx.moveTo(light.x, light.y);
      for(var pc = 0; pc < pathCount; pc++){	
        
        this.ctx.lineTo(light.path[pc].x, light.path[pc].y);
        
        if(light.canSpawn){
          if(this.rand(0, 100) == 0){
            light.canSpawn = false;
            this.createL(light.path[pc].x, light.path[pc].y, false);
          }	
        }
      }
      
/*      if(!light.hasFired){
        this.ctx.fillStyle = 'rgba(255, 255, 255, '+this.rand(4, 12)/100+')';
        this.ctx.fillRect(0, 0, this.cw, this.ch);	
      }
      
      if(this.rand(0, 30) == 0){
        this.ctx.fillStyle = 'rgba(255, 255, 255, '+this.rand(1, 3)/100+')';
        this.ctx.fillRect(0, 0, this.cw, this.ch);	
      }	*/
      
      this.ctx.stroke();
    };
  };
  
/*=============================================================================*/	
/* Lightning Timer
/*=============================================================================*/
  this.lightningTimer = function(){
    this.lightTimeCurrent++;
    if(this.lightTimeCurrent >= this.lightTimeTotal){
      var newX = this.rand(100, cw - 100);
      var newY = this.rand(0, ch / 2); 
      var createCount = this.rand(1, 3);
      while(createCount--){							
        this.createL(newX, newY, true);
      }
      this.lightTimeCurrent = 0;
      this.lightTimeTotal = this.rand(30, 100);
    }
  }
    
/*=============================================================================*/	
/* Clear Canvas
/*=============================================================================*/
    this.clearCanvas = function(){
/*    this.ctx.globalCompositeOperation = 'destination-out';
      this.ctx.fillStyle = 'rgba(0,0,0,'+this.rand(1, 30)/100+')';
      this.ctx.fillRect(0,0,this.cw,this.ch);
      this.ctx.globalCompositeOperation = 'source-over';*/
    };
  
/*=============================================================================*/	
/* Resize on Canvas on Window Resize
/*=============================================================================*/
$(window).on('resize', function(){
  _this.cw = _this.c.width = window.innerWidth;
  _this.ch = _this.c.height = window.innerHeight;  
});
    
/*=============================================================================*/	
/* Animation Loop
/*=============================================================================*/
  this.loop = function(){
        var loopIt = function(){
      requestAnimationFrame(loopIt, _this.c);
      _this.clearCanvas();
      _this.updateL();
      _this.lightningTimer();
      _this.renderL();	
    };
    loopIt();					
  };
  
};

/*=============================================================================*/	
/* Check Canvas Support
/*=============================================================================*/
var isCanvasSupported = function(){
  var elem = document.createElement('canvas');
  return !!(elem.getContext && elem.getContext('2d'));
};

/*=============================================================================*/	
/* Setup requestAnimationFrame
/*=============================================================================*/
var setupRAF = function(){
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x){
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
  };
  
  if(!window.requestAnimationFrame){
    window.requestAnimationFrame = function(callback, element){
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  };
  
  if (!window.cancelAnimationFrame){
    window.cancelAnimationFrame = function(id){
      clearTimeout(id);
    };
  };
};			

/*=============================================================================*/	
/* Define Canvas and Initialize
/*=============================================================================*/
$(window).on('load', function(){
	if(isCanvasSupported){
		var c = document.getElementById("monCanvas");
		var cw = c.width = window.innerWidth;
		var ch = c.height = window.innerHeight;	
		var cl = new canvasLightning(c, cw, ch);				

		setupRAF();
		cl.init();
	}
});


$(window).on('load', function(){
	fetch('https://breaking-bad-quotes.herokuapp.com/v1/quotes').then(response => {
	  return response.json();
	}).then(data => {
	  	$("#quote").html(data[0].quote + "<br>_" + data[0].author);
	}).catch(err => {
	  // Do something for an error here
	});
	document.getElementsByTagName('body')[0].style = 
			'background: linear-gradient(#000, #151515);'
		+	' background-color: green;';
});
