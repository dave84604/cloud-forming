JCF

Json Cloud Forming.

This is a very lightweight AWS provisioning toolset based around cloud formation. 

It is a Node.js script base, where each project (created under dist) while specialise a set
of scripts to create cloud formaiton stacks useing Node.js code. There are a set of general utiulities in the bin directory for managing the stacks that are created. Things like

1. Git pull
2. Yum update
3. SSH to a server
4. etc - many more to follow

Inside the dist directory is an example project - ths is an idea of how this toolset will be used.

Note that this is very much a work-in-progress. Im currently going through and sanitizing the code
base after some use as a produciton/uat management tool. It did work nicely but it currently is not ready for use as the sanitization process will have undoubtedly broken certain parts which i havent yet had time to test.

