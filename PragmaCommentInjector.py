# Adds and updates filename as comment as first line in file for .h and .cpp
# Adds pragma once to .h files
# Removes and leading blank lines.
# The update will change the filename if it has been changed.

import os

# Define ANSI color codes
HEADER = "\033[99m"
OKBLUE = "\033[94m"
OKCYAN = "\033[96m"
OKGREEN = "\033[92m"
OKYELLOW = "\033[93m"
ADD = "\033[93m"  # Yellow plus for added comments and pragmas
BOLD = "\033[1m"
FAIL = "\033[91m"
ENDC = "\033[0m"


def update_files(directory):
    # Statistics
    stats = {
        "files_checked": 0,
        "pragmas_added": 0,
        "filenames_added": 0,
        "filenames_corrected": 0,
        "files_updated": 0,
        "file_actions": [],  # To store actions for each file
    }

    print(
        f"{HEADER}Checking header and source files for pragmas and filename comments...{ENDC}"
    )
    print(f"{OKBLUE}File Updates:{ENDC}")
    for root, _dirs, files in os.walk(directory):
        for file in files:
            if file.endswith((".h", ".cpp", ".js")):
                file_path = os.path.join(root, file)
                file_updated, actions = process_file(file_path, stats)
                if actions:
                    stats["file_actions"].extend(actions)
                    for action in actions:
                        print(action)

    # Print the summary
    print_summary(stats)


def read_file(file_path):
    try:
        with open(file_path, "r") as file:
            return file.readlines()
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return None


def write_file(file_path, lines):
    try:
        with open(file_path, "w") as file:
            file.writelines(lines)
    except Exception as e:
        print(f"Error writing to {file_path}: {e}")


def get_indices(lines):
    pragma_index = -1
    for i, line in enumerate(lines):
        if "#pragma once" in line:
            pragma_index = i
    return pragma_index

def remove_initial_blank_lines(lines):
    while lines and not lines[0].strip():
        lines.pop(0)
    return lines

def is_filename_comment(comment, file_extension):
    expected_end = file_extension
    return (comment.strip().startswith("//") and comment.strip().endswith(expected_end))

def is_correct_filename_comment(comment, file_name_comment):
    return comment == file_name_comment

def update_filename_comment(lines, file_name_comment, file_name, file_extension, stats, actions):
    if not is_filename_comment(lines[0], file_extension):
        lines.insert(0, file_name_comment)
        stats["filenames_added"] += 1
        actions.append(f"{ADD}➕ Filename comment")
        return lines, True
    else:
        if (is_correct_filename_comment(lines[0], file_name_comment)):
            return lines, False
        else:
            lines[0] = f"// {file_name}\n"
            stats["filenames_corrected"] += 1
            actions.append("✅ Filename comment")
            return lines, True

def update_pragma_once(lines, pragma_index, stats, actions):
    if pragma_index == -1 or pragma_index > 1:
        if pragma_index > 1:
            lines.pop(pragma_index)
            actions.append("✅ Pragma once")
        else:
            stats["pragmas_added"] += 1
            actions.append(f"{ADD}➕ Pragma once")
        lines.insert(1, "#pragma once\n")
        lines.insert(2, "\n")  # Ensure a blank line after #pragma once.
        return lines, True
    return lines, False

def update_header(lines, file_path, pragma_index, stats, actions):
    file_extension = ".h" if file_path.endswith(".h") else ".cpp"
    file_name = os.path.basename(file_path)
    file_name_comment = f"// {file_name}\n"

    lines, filename_updated = update_filename_comment(lines, file_name_comment, file_name, file_extension, stats, actions)

    pragma_updated = False
    if file_path.endswith(".h"):
        lines, pragma_updated = update_pragma_once(lines, pragma_index, stats, actions)

        # Only adjust blank lines between the header comment and pragma once for .h files.
        if filename_updated or pragma_updated:
            while len(lines) > 2 and lines[2].strip() == "":
                lines.pop(2)
            lines.insert(2, "\n")

    return lines, filename_updated or pragma_updated

def process_file(file_path, stats):
    actions = []
    lines = read_file(file_path)
    if lines is None:
        return False, []

    lines = remove_initial_blank_lines(lines)

    stats["files_checked"] += 1

    pragma_index = get_indices(lines)
    updated_lines, file_updated = update_header(lines, file_path, pragma_index, stats, actions)

    if file_updated:
        write_file(file_path, updated_lines)
        stats["files_updated"] += 1

        # Add actions to the output if the file is updated.
        print(f"{OKBLUE}File: {file_path}{ENDC}")

    return file_updated, actions


def print_summary(stats):
    print(f"\n{OKBLUE}Process Summary:{ENDC}")
    print(f"{OKGREEN}┌─────────────────────┬───────┐{ENDC}")
    print(
        f"{OKGREEN}│{OKYELLOW} Files Checked       {OKGREEN}│{ENDC} {str(stats['files_checked']).rjust(5)} {OKGREEN}│{ENDC}"
    )
    print(
        f"{OKGREEN}│{OKYELLOW} Pragmas Added       {OKGREEN}│{ENDC} {str(stats['pragmas_added']).rjust(5)}{ENDC} {OKGREEN}│{ENDC}"
    )
    print(
        f"{OKGREEN}│{OKYELLOW} Comments Added      {OKGREEN}│{ENDC} {str(stats['filenames_added']).rjust(5)}{ENDC} {OKGREEN}│{ENDC}"
    )
    print(
        f"{OKGREEN}│{OKYELLOW} Comments Fixed      {OKGREEN}│{ENDC} {str(stats['filenames_corrected']).rjust(5)}{ENDC} {OKGREEN}│{ENDC}"
    )
    print(
        f"{OKGREEN}│{FAIL}{BOLD} Total Files Updated{OKGREEN} │{ENDC} {FAIL}{str(stats['files_updated']).rjust(5)}{ENDC} {OKGREEN}│{ENDC}"
    )
    print(f"{OKGREEN}└─────────────────────┴───────┘{ENDC}")


# Update files in the /lib directory
update_files("./src")
update_files("./include")
update_files("./web-app/src")