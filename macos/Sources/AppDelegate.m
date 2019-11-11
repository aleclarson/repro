#import "AppDelegate.h"
#import "AppWindow.h"

@implementation AppDelegate
{
  AppWindow *_app;
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
  _app = [[AppWindow alloc] init];

  [_app makeKeyAndOrderFront:nil];
}

@end
