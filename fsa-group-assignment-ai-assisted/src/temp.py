
import os

def delete_tsx_files(root_dir):
    """
    Deletes all .tsx files in the given directory and its subdirectories.
    """
    for dirpath, _, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.endswith(".tsx"):
                file_path = os.path.join(dirpath, filename)
                try:
                    os.remove(file_path)
                    print(f"{file_path}")
                except Exception as e:
                    print(f"Failed to delete {file_path}: {e}")

# Example usage:
# delete_tsx_files("/path/to/your/directory")

delete_tsx_files("/Users/atul.yadav/Desktop/FSA/fsa-group-assignment/src/components")