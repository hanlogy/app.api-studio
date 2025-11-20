//
//  HttpServerManager.m
//  ApiStudio-macOS
//
//  Created by Zhiguang Chen on 2025-11-19.
//

#import "HttpServerManager.h"

@interface RCT_EXTERN_MODULE (HttpServerManager, RCTEventEmitter)

RCT_EXTERN_METHOD(startServer : (NSDictionary *)options)
RCT_EXTERN_METHOD(stopServer : (NSDictionary *)options)
RCT_EXTERN_METHOD(sendResponse : (NSDictionary *)options)

@end
