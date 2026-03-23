# NFS Event Delegation: Bridging the Gap Between Remote Changes and Client Notifications

## Introduction

Network File System (NFS) provides a powerful way to built a vfs on osx, but it has a fundamental limitation when it comes to event propagation. This document explores how event delegation works in NFS, the challenges with remote changes, and an innovative solution to ensure proper notification delivery to client applications.

## Standard File System Event Flow

Before diving into NFS specifics, let's understand how file system events work in a local environment:

![Regular FS events](./fs_event_file_write-dark.svg#gh-dark-mode-only)
![Regular FS events](./fs_event_file_write-light.svg#gh-light-mode-only)

1. **Application Write**: An application (e.g., Emacs) writes to a file
2. **File System Update**: The file system modifies the inode content
3. **FSEvent Trigger**: On macOS, the FSEvent system detects this change
4. **Event Propagation**: FSEvents propagates an event with the flag `itemModified` (or similar)
5. **Observer Notification**: Registered observers (Finder, Quick Look, etc.) react to these changes

This local flow ensures seamless integration—changes made by Emacs are immediately visible in Finder's Quick Look and other observing applications.

## NFS Event Delegation Architecture

When working with files on an NFS-mounted drive, the event flow becomes more complex. The delegation pattern involves multiple layers:

### Local Change Flow (Client-Initiated)

When a change originates from the client itself, the flow works as expected:


![FS events - client side write](./fs_event_nfs_clientside_write-dark.svg#gh-dark-mode-only)
![FS events - client side write](./fs_event_nfs_clientside_write-light.svg#gh-light-mode-only)


In this scenario, the complete event chain functions correctly. When you work locally on an NFS drive, changes made in Emacs will eventually reach Finder and other observers.

## The Problem: Remote Changes

The fundamental issue arises when changes originate from outside the client's session. When the backing state is modified by a remote actor:

![FS events - client side write](./nfs_remote_change-dark.svg#gh-dark-mode-only)
![FS events - client side write](./nfs_remote_change-light.svg#gh-light-mode-only)

**The Breakdown**: The NFS server lacks a function to call back to the client. There is no reverse notification channel, meaning the client remains unaware of these remote changes.

### Workarounds and Limitations

Applications have developed various workarounds to cope with this limitation:

- **Polling**: Some applications poll at regular intervals to check for changes
- **Focus-based Checks**: Applications like VSCode check for file changes when the window regains focus
- **Attribute Monitoring**: Some applications watch for attribute changes rather than content changes

**Limitations**:
- Not guaranteed to catch all changes
- Finder, for example, doesn't implement polling and relies entirely on attribute change events
- Application-dependent behavior leads to inconsistent user experience

## The Solution: Event Side Channel

To address this fundamental architectural limitation, we've implemented an innovative "side channel" approach that ensures remote changes properly propagate to client observers.

### Architecture

The side channel inserts an additional layer into the NFS server's event processing:

![FS events - client side write](./nfs_sidechannel_write_file-dark.svg#gh-dark-mode-only)
![FS events - client side write](./nfs_sidechannel_write_file-light.svg#gh-light-mode-only)

### How It Works

1. **Remote Detection**: A remote actor performs a PUT operation on a file
2. **Backing State Update**: The backing state is updated and notifies the NFS server
3. **Side Channel Activation**: Instead of doing nothing, the side channel component:
   - Generates a synthetic file write operation on the file system
   - This write targets the specific file that was remotely changed
4. **NFS Client Processing**: The NFS client receives this write operation
   - It recognizes this as a side channel operation
   - Processes the event generation logic
   - **Does not** forward the write back to the backing state (preventing loops)
5. **Event Generation**: The NFS client, having seen a "write" on the file, now has the opportunity to trigger FSEvents
6. **Observer Notification**: All registered observers receive the change notification

### Key Characteristics

- **Transparent to Applications**: The change appears exactly as if it originated locally
- **No Redundant Operations**: The side channel write is intercepted before reaching the backing state
- **Event Loop Prevention**: By intercepting the write, we prevent infinite loops
- **Standard Event Semantics**: Applications receive standard FSEvents with proper flags

## Benefits

This side channel implementation ensures that:

1. **Consistency**: Remote changes appear identical to local changes from the perspective of client applications
2. **Real-time Updates**: No need for polling or delayed checks
3. **Universal Coverage**: All FSEvent observers receive notifications, regardless of whether they implement polling
4. **Standard Compliance**: The solution works within existing file system event frameworks without requiring application changes

## Conclusion

The NFS event delegation side channel bridges a critical gap in distributed file system event propagation. By leveraging the existing client-side event generation mechanisms through strategically placed synthetic writes, we ensure that remote changes are properly notified to all observers, maintaining the expected file system behavior across local and network boundaries.

This approach demonstrates how understanding the fundamental architecture of distributed systems allows us to design elegant solutions that work within existing constraints rather than fighting against them.
