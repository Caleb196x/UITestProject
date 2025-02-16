import * as UE from 'ue'
import * as React from 'react';
import * as Components from './components';
import {argv} from 'puerts';
import {ReactUMG, Root} from 'react-umg'

let coreWidget = (argv.getByName("CoreWidget") as UE.SmartUICoreWidget);

ReactUMG.init(coreWidget);

function Main() : Root {
    return ReactUMG.render(
        <Components.MainComponent/>
    );
}

Main()
// todo: call release when js file exits
ReactUMG.release();
