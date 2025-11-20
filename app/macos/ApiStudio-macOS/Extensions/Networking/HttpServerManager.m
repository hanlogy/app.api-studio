//
//  HttpServerManager.m
//  ApiStudio-macOS
//
//  Created by Zhiguang Chen on 2025-11-19.
//

#import "HttpServerManager.h"

@interface RCT_EXTERN_MODULE (HttpServerManager, RCTEventEmitter)

RCT_EXTERN_METHOD(startServer : (nonnull NSNumber *)port)
RCT_EXTERN_METHOD(stopServer : (nonnull NSNumber *)port)
RCT_EXTERN_METHOD(sendResponse : (nonnull NSNumber *)port connectionId : (
    NSString *)connectionId response : (NSString *)response)

@end
