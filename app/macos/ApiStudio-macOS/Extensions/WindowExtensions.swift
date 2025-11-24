//
//  WindowExtensions.swift
//  ApiStudio-macOS
//
//  Created by Zhiguang Chen on 2025-11-18.
//

import Cocoa

@objc extension NSWindow {
  @objc func adjustTitleBar() {
    self.titleVisibility = .hidden
    // self.titlebarAppearsTransparent = true
  }
}
