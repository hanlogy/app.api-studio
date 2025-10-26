//
//  FolderPicker.m
//  ApiStudio-macOS
//
//  Created by Zhiguang Chen on 2025-10-25.
//

#import "FolderPicker.h"
#import <Cocoa/Cocoa.h>

@implementation FolderPicker

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(selectFolder:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    NSOpenPanel *panel = [NSOpenPanel openPanel];
    panel.canChooseFiles = NO;
    panel.canChooseDirectories = YES;
    panel.allowsMultipleSelection = NO;

    if ([panel runModal] == NSModalResponseOK) {
      NSURL *url = [panel URL];
      if (url) {
        resolve([url path]);
      } else {
        reject(@"ERROR", @"No folder selected", nil);
      }
    } else {
      reject(@"CANCELLED", @"User cancelled folder selection", nil);
    }
  });
}

@end
