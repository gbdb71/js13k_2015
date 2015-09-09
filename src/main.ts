/// <reference path="core/Game" />
/// <reference path="state/SplashScreen" />
/// <reference path="state/PrecisionChallenge" />
/// <reference path="state/SpeedChallenge" />
/// <reference path="state/Menu" />
/// <reference path="state/Tutorial" />
/// <reference path="game/Player" />


let mgame = new core.Game('canvas');
mgame.AddState('splash', new state.SplashScreen());
mgame.AddState('menu', new state.Menu());
mgame.AddState('precision-challenge', new state.PrecisionChallenge());
mgame.AddState('speed-challenge', new state.SpeedChalenge());
mgame.AddState('tutorial', new state.Tutorial());
mgame.Play('splash');
mgame.Start();
