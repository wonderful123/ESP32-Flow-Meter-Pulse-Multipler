"""
conditional_partiton_flash.py

This script is integrated into the PlatformIO build process to conditionally flash firmware and SPIFFS images 
to an ESP32 based on the MD5 hash comparison of existing files. It enhances deployment efficiency by only 
updating partitions that have changed since the last programming session. This reduces unnecessary write operations,
prolongs the lifespan of the device's flash memory, and speeds up the development process by skipping redundant flashes.

The script:
- Checks if there's a new version of the firmware or SPIFFS by comparing the MD5 hash of the current build files
  against previously stored hashes.
- Flashes new versions to the designated partitions on the ESP32 if changes are detected.
- Can be easily modified for different partition schemes by adjusting partition offsets within the script.

Usage:
- Place this script in the 'scripts' directory of the PlatformIO project.
- Refer to this script in the 'platformio.ini' under `extra_scripts` to ensure it executes before each upload.
"""

import os
import hashlib

Import("env", "projenv")


def file_hash(filename):
    """Generate an MD5 hash of a file."""
    hash_md5 = hashlib.md5()
    with open(filename, "rb") as file:
        for chunk in iter(lambda: file.read(4096), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()


def check_for_update(file_path):
    """Check if the file at file_path needs to be updated based on its hash."""
    if not os.path.exists(file_path):
        return True  # Always update if file doesn't exist

    current_hash = file_hash(file_path)
    hash_file_path = file_path + ".hash"

    # Compare current hash with the stored hash
    if os.path.exists(hash_file_path):
        with open(hash_file_path, "r") as hash_file:
            previous_hash = hash_file.read().strip()
        if current_hash == previous_hash:
            return False

    # Update the hash file with the new hash
    with open(hash_file_path, "w") as hash_file:
        hash_file.write(current_hash)

    return True


def flash_firmware(env, firmware_path, partition_offset):
    """Flash firmware to a specific partition offset."""
    print(f"Flashing new firmware to offset {partition_offset}...")
    env.Execute(
        f"esptool.py --chip esp32 --port COM3 --baud 921600 write_flash -z {partition_offset} {firmware_path}"
    )


def check_and_upload(source, target, env):
    firmware_path = env.subst("$BUILD_DIR/${PROGNAME}.bin")
    spiffs_image_path = env.subst("$BUILD_DIR/spiffs.bin")

    # Check and flash firmware if needed
    if check_for_update(firmware_path):
        flash_firmware(
            env, firmware_path, "0x10000"
        )  # Adjust partition offset as needed

    # Check and flash SPIFFS if needed
    if check_for_update(spiffs_image_path):
        flash_firmware(
            env, spiffs_image_path, "0x300000"
        )  # Adjust partition offset as needed
    else:
        print("SPIFFS image is up to date, no flashing needed.")


env.AddPreAction("upload", check_and_upload)
