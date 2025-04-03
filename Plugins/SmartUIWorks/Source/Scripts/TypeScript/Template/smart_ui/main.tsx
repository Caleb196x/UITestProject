import * as UE from 'ue'
import * as React from 'react';
import * as Components from './components/main_component';
import {$Nullable} from 'puerts';
import {ReactUMG, Root} from 'reactUMG'

export function Main(coreWidget: $Nullable<UE.SmartUICoreWidget>) : Root {
    ReactUMG.init(coreWidget);
    return ReactUMG.render(
        <Components.MainComponent/>
    );
}
