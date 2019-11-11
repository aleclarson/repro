#import "AppDelegate.h"
#import "AppWindow.h"

@implementation AppDelegate
{
  AppWindow *_root1;
  AppWindow *_root2;
}

+ (instancetype)delegate
{
  static dispatch_once_t onceToken;
  static AppDelegate *delegate = nil;
  dispatch_once(&onceToken, ^{
    delegate = [AppDelegate new];
  });
  return delegate;
}

- (void)applicationDidFinishLaunching:(__unused NSNotification *)notification
{
  _root1 = [[AppWindow alloc] initWithModuleName:@"Root1"];
  _root2 = [[AppWindow alloc] initWithModuleName:@"Root2"];
  
  [_root2 makeKeyAndOrderFront:nil];
  [_root1 makeKeyAndOrderFront:nil];
}

@end
