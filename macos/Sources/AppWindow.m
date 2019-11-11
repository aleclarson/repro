#import <React/RCTBundleURLProvider.h>
#import <React/RCTKeyCommands.h>
#import "AppWindow.h"

@implementation AppWindow

- (instancetype)initWithModuleName:(NSString *)moduleName
{
  NSURL *bundleURL = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  RCTBridge *bridge = [[RCTBridge alloc] initWithBundleURL:bundleURL moduleProvider:nil launchOptions:nil];

  if (self = [super initWithBridge:bridge
                       contentRect:NSScreen.mainScreen.frame
                         styleMask:NSWindowStyleMaskMiniaturizable|NSWindowStyleMaskClosable|NSWindowStyleMaskTitled|NSWindowStyleMaskResizable
                             defer:NO]
  ) {
    self.delegate = self;
    self.hasShadow = YES;
    
    // Render the React application.
    self.contentView = [[RCTRootView alloc] initWithBridge:bridge moduleName:moduleName initialProperties:nil];
    
    __weak __typeof(self) weakSelf = self;
    RCTKeyCommands *commands = [RCTKeyCommands sharedInstance];
    
    [commands registerKeyCommandWithInput:@"q" modifierFlags:NSEventModifierFlagCommand action:^(__unused NSEvent *command) {
      [NSApp terminate:nil];
    }];
    
    [commands registerKeyCommandWithInput:@"w" modifierFlags:NSEventModifierFlagCommand action:^(__unused NSEvent *command) {
      if (weakSelf.isKeyWindow) {
        [weakSelf close];
      }
    }];
  }
  return self;
}

- (BOOL)canBecomeKeyWindow
{
  return YES;
}

@end
