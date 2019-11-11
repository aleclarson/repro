#import <AppKit/AppKit.h>
#import <React/RCTWindow.h>

@interface AppWindow : RCTWindow <NSWindowDelegate>

- (instancetype)initWithModuleName:(NSString *)moduleName;

@end
