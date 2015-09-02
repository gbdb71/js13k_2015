/// <reference path="core/Game" />
/// <reference path="state/BootState" />
/// <reference path="state/LevelSelect" />


let mgame = new core.Game('canvas');
mgame.AddState('boot', new state.BootState());
mgame.AddState('level-select', new state.LevelSelect());
mgame.Play('boot');
mgame.Start();
