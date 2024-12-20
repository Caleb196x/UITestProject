@0xfc4c8a947201922d;

interface Unreal {
    struct Pointer {
        addr @0 :UInt64;
    }

    interface Object {
        constructor @0 (outer :Object, name :Text, objectFlags :UInt32) ->();
        createDefaultSubobject @1 (p0 :Text, p1 :Class, p2 :Class, p3 :Bool, p4 :Bool) -> (object :Object);
        executeUbergraph @2 (entryPoint :Int32) -> ();
        getClass @3 () -> (class :Class);
        getName @4 () -> (name :Text);
        getOuter @5 () -> (outer :Object);
        hasAnyFlags @6 (flags :UInt32) -> (result :Bool);
        hasAllFlags @7 (flags :UInt32) -> (result :Bool);
        hasClassFlag @8 (flag :UInt32) -> (result :Bool);
        hasClassFlagEx @9 (flag :UInt32) -> (result :Bool);
        isA @10 (p0 :Class) -> (result :Bool);
        isChildOf @11 (p0 :Class) -> (result :Bool);
        isNative @12 () -> (result :Bool);

        staticClass @13 () -> (class :Class);
        find @14 (originInName :Text, outer :Object) -> (object :Object);
        load @15 (inName :Text) -> (object :Object);
    }

    interface Class {
        constructor @0 (outer :Object, name :Text, objectFlags :UInt32) ->();
        staticClass @1 () -> (class :Class);
        find @2 (originInName :Text, outer :Object) -> (object :Object);
        load @3 (inName :Text) -> (object :Object);
    }

    interface MyObject extends(Object) {
        constructor @0 ();
        add @1 (obj :Pointer, p0 :Int32, p1 :Int32) -> (res :Int32);
        sub @2 (obj :Pointer, p0 :Int32, p1 :Int32) -> (res :Int32);
        mul @3 (obj :Pointer, p0 :Int32, p1 :Int32) -> (res :Int32);
        div @4 (obj :Pointer, p0 :Int32, p1 :Int32) -> (res :Int32);

        staticClass @5 () -> (class :Class);
        find @6 (originInName :Text, outer :Object) -> (object :Object);
        load @7 (inName :Text) -> (object :Object);

        struct Properties {
            name @0 :Text;
        }
    }

    newObject @0 (ueClass :Class) -> (object :AnyPointer); 
}
