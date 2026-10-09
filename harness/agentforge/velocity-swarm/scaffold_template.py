#!/usr/bin/env python3
"""
Scaffolds a new template repository implementing the 10 Invariant Forteiva/BuildShift Architecture.
Used to generate clean test repositories for velocity-web-architect validation.
"""
import os
import sys
import shutil

def scaffold(target_dir, app_name, brand_slug):
    os.makedirs(target_dir, exist_ok=True)
    source_dir = "/home/manjaro/build-swift"
    
    # Files and folders to copy
    items = ["package.json", "tsconfig.json", "tsconfig.app.json", "tsconfig.node.json", 
             "vite.config.ts", "tailwind.config.js", "postcss.config.js", "index.html", 
             "src", "public"]
             
    for item in items:
        s = os.path.join(source_dir, item)
        d = os.path.join(target_dir, item)
        if os.path.isdir(s):
            if os.path.exists(d):
                shutil.rmtree(d)
            shutil.copytree(s, d)
        elif os.path.isfile(s):
            shutil.copy2(s, d)
            
    # Symlink node_modules to avoid redundant 200MB download
    nm_source = os.path.join(source_dir, "node_modules")
    nm_dest = os.path.join(target_dir, "node_modules")
    if not os.path.exists(nm_dest):
        os.symlink(nm_source, nm_dest)
        
    print(f"[+] Scaffolding complete for {app_name} at {target_dir}")

if __name__ == "__main__":
    t_dir = sys.argv[1] if len(sys.argv) > 1 else "/home/manjaro/velocity-template-test"
    scaffold(t_dir, "NovaFlow Cloud Technologies", "novaflow")
