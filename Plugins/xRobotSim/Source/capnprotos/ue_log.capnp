@0xbbe893163cfc778c

interface UELog 
{
    debug @0 (message: Text) -> ();
    info @0 (message: Text) -> ();
    warn @1 (message: Text) -> ();
    error @2 (message: Text) -> ();
    fatal @3 (message: Text) -> ();
}