/// <reference path="core/Game" />
/// <reference path="state/SplashScreen" />
/// <reference path="state/LevelSelect" />
/// <reference path="state/Menu" />
/// <reference path="state/Tutorial" />
/// <reference path="game/Player" />


let mgame = new core.Game('canvas');
mgame.AddState('splash', new state.SplashScreen());
mgame.AddState('menu', new state.Menu());
mgame.AddState('select', new state.LevelSelect());
mgame.AddState('tutorial', new state.Tutorial());
mgame.Play('splash');
mgame.Start();
