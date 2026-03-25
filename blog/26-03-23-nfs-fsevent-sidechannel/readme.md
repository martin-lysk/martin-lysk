---
  slug: nfs3-event-side-channel
  tags: [vfs, nfs3]
  date: 2026-03-23
  image: ./nfs_sidechannel_write_file-light
---

# Making NFS3 reactive

Network File System (NFS) provides a powerful way to built a vfs on OSx, but it has a fundamental limitation when it comes to event propagation. This article explores how event delegation works in NFS, the challenges with remote changes, and an approach to ensure proper notification delivery to client applications using a side-channel.

<!-- truncate -->

The topic outlined here is part of a bigger research on a Gerneral Network Filesystem (GNFS) together with the braid.org group - If you want to learn more checkout https://braid.org/apps/gnfs

## Standard File System Event Flow

Before diving into NFS specifics, let's understand how file system events work in a local environment:

![Regular FS events](./fs_event_file_write-dark.svg#gh-dark-mode-only)
![Regular FS events](./fs_event_file_write-light.svg#gh-light-mode-only)

1. **Application Write**: An application (e.g., Emacs) writes to a file
2. **File System Update**: The file system modifies the inode content
3. **FSEvent Trigger**: On macOS, the FSEvent system detects this change
4. **Event Propagation**: FSEvents propagates an event with the flag `itemModified` (or similar)
5. **Observer Notification**: Registered observers (Finder, Quick Look, etc.) react to these changes

This flow ensures changes made by Emacs are immediately propagated to applications listening to file system changes lik Finder's Quick Look and other applications.

## NFS Event Delegation Architecture

When working with files on an NFS-mounted drive, the event flow becomes more complex. The delegation pattern involves multiple layers:

### Local Change Flow (Client-Initiated)

When a change originates from the client itself, the flow works as expected:


![FS events - client side write](./fs_event_nfs_clientside_write-dark.svg#gh-dark-mode-only)
![FS events - client side write](./fs_event_nfs_clientside_write-light.svg#gh-light-mode-only)


In this scenario, the complete event chain functions correctly. When you work locally on an NFS drive, changes made in Emacs will eventually reach Finder and other observers.

## The Problem: Remote Changes

An issue arises when changes originate from outside the client's local filesystem:

![FS events - client side write](./nfs_remote_change-dark.svg#gh-dark-mode-only)
![FS events - client side write](./nfs_remote_change-light.svg#gh-light-mode-only)

**The Breakdown**: The NFS3 protocol lacks a function to propagate changes on the server back to the client. There is no reverse notification channel, meaning the client remains unaware of changes happening remote.

### Workarounds and Limitations

Applications have developed various workarounds to cope with this limitation:

- **Polling**: Some applications poll at regular intervals to check for changes
- **Focus-based Checks**: Applications like VSCode check for file changes when the window regains focus

**Limitations**:
- The NFS client may caches file attirbutes locally even with polling the client may misses changes
- Some applications do not poll - Finder, for example, relies entirely on attribute change events

## The Solution: Event Side Channel

To address this architectural limitation, below, I describe a way to use a "side channel" approach to address these limitations and ensures remote changes properly propagate to client observers.

### Architecture

The side channel inserts an additional layer into the NFS server's event processing:

![FS events - client side write](./nfs_sidechannel_write_file-dark.svg#gh-dark-mode-only)
![FS events - client side write](./nfs_sidechannel_write_file-light.svg#gh-light-mode-only)

### How It Works

1. **Remote Detection**: A remote actor performs a change remotely - here a `put` on the backing state
2. **Backing State Update**: the NFS server reconises the change - The backing state notifies the server via `send()`
3. **Side Channel Activation**: Instead of doing nothing, the side channel:
   - Generates a synthetic file write operation on the file system
   - registers a sidechannle write on the NFS Server
   - This write targets the specific file that was remotely changed
4. **NFS Client Processing**: The NFS Client forwards the write operation to the NFS Server
5. **NFS Server Processing**: The NFS Server receives the write operation and
   - It recognizes this as a side channel operation
   - **Does not** forward the write back to the backing state (preventing loops)
   - And returns a success result for the write operation, together with the latest attributes of the changed file state from the backing state
5. **Event Generation**: The NFS client, having seen a "write" on the file, now triggers an FSEvents like the write was comming from just another local application
6. **Observer Notification**: All registered observers receive the change notification

### Key Characteristics

- **Transparent to Applications**: The change appears exactly as if it originated locally
- **No Redundant Operations**: The side channel write is intercepted before reaching the backing state
- **Event Loop Prevention**: By intercepting the write, we prevent infinite loops
- **Standard Event Semantics**: Applications receive standard FSEvents with proper flags

## Benefits

This side channel approach ensures that:

1. **Consistency**: Remote changes appear identical to local changes from the perspective of client applications
2. **Real-time Updates**: No need for polling or delayed checks
3. **Universal Coverage**: All FSEvent observers receive notifications, regardless of whether they implement polling
4. **Standard Compliance**: The solution works within existing file system event frameworks without requiring application changes

## Conclusion

The NFS event delegation side channel can bridges a critical gap in distributed file system event propagation. By leveraging the existing client-side event generation mechanisms through synthetic writes, remote changes are properly notify  all observers, maintaining the expected file system behavior across local and network boundaries.

