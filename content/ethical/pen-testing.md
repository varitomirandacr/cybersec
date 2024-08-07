# Pen Testing

## Overview

1. Metasploit Framework
2. Metasploit Architecture
3. Installation and Configuration
4. Pen Testing Plan: Prepare and Launch attack

### EC-Council Code if Ethics

1. Privacy
2. Intellectual property
3. Disclosure of dangers
4. Areas of competence
5. Software use
6. Deceptive financial practices
7. Property use
8. Disclosure to concerned parties
9. Good management
10. Knowledge sharing
11. Confidence
12. Ethical conduct
13. Association with malicious hackers
14. Purposefully compromise clients
15. Authorization
16. No Black Hat Activity
17. No underground hacking
18. No innapropriate references
19. No felony convictions

[EC-Council CoE](https://www.eccouncil.org/code-of-ethics/)

### (ISC)^2 Code of Ethics
[EC-Council CoE](https://www.isc2.org/ethics/)

### The Penetration Testing Execution Standard
[PenTest Standards](https://www.pentest-standard.org)

1. Pre-engagement interactions
2. Intelligence gathering
3. Threat modelling
4. Vulnerability analysis
5. Exploitation
6. Post-exploitation
7. Reporting

### Metasploit Framework 

#### Components & Terminology
1. Modules
2. Scanners
3. Exploits
4. Payloads

#### First Module - Framework
1. Intelligence Gathering
    - Two Methods:
        - Active (Overt): interacting with targets, identify active systems, services, creating accounts on applications, directly gather info.
        - Passive (Covert): avoiding interactions with targets, find info about systems, services, read about the application, searching other sources.
            - whois: domain and dns query commands
            - host, nslookup, and dig
            - auxiliary/gather/enum_dns
            - auxiliary/gather/shodan_search
            - auxiliary/gather/ssllabs_scan

    - Techniques:
        - Network scanning
        - Port scanning
        - Service version scanning
        - Service configuration scanning
        - Fuzzing


2. Network Scanning
    - Scan assets on a target network
        - auxiliary/scanner (module)
            - discovery: 
                - arp_sweep
                - ipv6_neighbor
    - TCP and UDP port scanning
        - auxiliary/scanner/portscan/syn (module): syn pro packets
        - auxiliary/scanner/portscan/tcp (module): tcp through handshake to identify open ports
        - auxiliary/scanner/portscan/udp_sweep (module): find common and more udp ports
    - Service Scanning:
        - auxiliary/scanner/ftp/ftp_version
        - auxiliary/scanner/http/http_version
        - auxiliary/scanner/smb/smb_version
        - auxiliary/scanner/ssh/ssh_version

    - *NMAP (outside of metasploit):*
        - can be used to gather data fmor separate team
        - can import scans into metasploit database
        - can be run inside mfsconsole

3. Vulnerability Scanning
    - no authentication auxiliary modules
    - login auxiliary modules
    - exploit modules that check for the vulnerability

    - 3rd-party vulnerability scanning
        - Data ingestion
        - Scan configuration
        - Scan management

    - SQL Map (databases)
    - WMap (Web)
    - OpenVAS (Vulnerability scanning platform)

    - Commercial Scanning Products:
        - Can be integrated within metasploit
        - Tenable Security Nessus:
            - [Tenable](https://www.tenable.com/products/nessus/nessus-professional)
        - Rapid7 Nexpose:
            - [Rapid7](https://www.rapid7.com/products/nexpose/)

4. Exploitation
    - Attack Methods:
        - Active:
            - Target specific systems with known and exploitable weaknesses
            - Connect to vulnerable service on the target
            - Send exploits to the service
            - Execute payload on the target

            - How it works:
                - Pen Tester > [exploit-payload] > Target system/service
        
        - Passive:
            - Target specific users with suspected and common weaknesses in available clients
            - Wait for clients to connect to our server
            - Feed exploits to vulnerable clients
            - Execute payload on the target

            - How it works:
                Pen Tester (Listener Service) > [exploit-payload] > Target clients  

            - Passive Vectors:
                - Phishing email
                - Fake advertising "malvertising"
                - Compromised web site
                - Enticing link

        - Payload Actions:
            - Shell
            - Execute command
            - Download files and execute
            - Start and interpreter
            - Interact with the user
            - Start Meterpreter
        
5. Post Exploitation
    - Post Modules: used when having a compromised system. Can simplify an automate:
        - Gather network, system and app information
        - Gather password hashes and credentials
        - Modify the system
        - Escalate provileges
    
    - Meterpreter: Metasploit interpreter
        - Post exploitation toolkit and environment:
            - Full command set, scripting and modules
            - File search, extraction, and upload
            - Process examination and manipulation
            - Passworwd hash collection
            - Packet captura, routing and forwarding

#### Second Module - Architecture
