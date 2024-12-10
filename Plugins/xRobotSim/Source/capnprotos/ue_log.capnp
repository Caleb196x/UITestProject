@0xbbe893163cfc778c;

interface UELog {
    debug @0 (message: Text) -> ();
    info @1 (message: Text) -> ();
    warn @2 (message: Text) -> ();
    error @3 (message: Text) -> ();
    fatal @4 (message: Text) -> ();
}
