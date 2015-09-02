/// <reference path="core/Game" />
/// <reference path="state/PlayState" />


let mgame = new core.Game('canvas');
mgame.AddState('demo', new state.PlayState());
mgame.Play('demo');
mgame.Start();
