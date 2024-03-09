Import("env")
import semantic_version

def before_upload(source, target, env):
    # Read version from the file
    with open('version.txt', 'r') as file:
        version_str = file.read().strip()
    version = semantic_version.Version(version_str)

    # Increment version
    new_version = version.next_patch()
    print(f"Current version: {version}")
    print(f"New version: {new_version}")

    # Update version.txt file
    with open('version.txt', 'w') as file:
        file.write(str(new_version))

    # Update build flag in the environment
    env.Replace(CPPDEFINES=[('FIRMWARE_VERSION', f'"{new_version}"')])