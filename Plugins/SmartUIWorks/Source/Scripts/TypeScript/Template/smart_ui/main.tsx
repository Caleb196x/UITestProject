import * as UE from 'ue'
import * as React from 'react';
import * as Components from './components/main_component';
import {$Nullable, argv} from 'puerts';
import {ReactUMG, Root} from 'react-umg'


export function Main(coreWidget: $Nullable<UE.SmartUICoreWidget>) : Root {
    console.log("running smart ui main")
    ReactUMG.init(coreWidget);
    return ReactUMG.render(
        <Components.MainComponent/>
    );
}
