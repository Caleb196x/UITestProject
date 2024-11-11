import unreal_engine as ue
import unreal
import cv

# ue.log('Hello i am a Python module')

class PyActorTest:

    # this is called on game start
    def begin_play(self):
        ue.log('Begin Play on Hero class')
        
    # this is called at every 'tick'    
    def tick(self, delta_time):
        # get current location
        location = self.uobject.get_actor_location()
        # increase Z honouring delta_time
        location.z += 1 * delta_time
        # set new location
        self.uobject.set_actor_location(location)
