import * as React from 'react';
import raptor_pro from '../../assets/raptor-pro.json';
import raptor_pro_atlas from '../../assets/raptor.atlas';
import { Spine } from 'reactUMG';

export const SpineUIExample = () => {

    return (
        <canvas>
            <Spine style={{width: '400px', height: '400px', justifySelf: 'center', positionAnchor: 'center center'}} 
                    skel={raptor_pro} atlas={raptor_pro_atlas} />
        </canvas>
    );
};