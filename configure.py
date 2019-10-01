# This file is part of TALER
# (C) 2019 GNUnet e.V.
#
# Authors:
# Author: ng0 <ng0@taler.net>
#
# Permission to use, copy, modify, and/or distribute this software for any
# purpose with or without fee is hereby granted.
#
# THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
# WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
# MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE
# LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES
# OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS,
# WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION,
# ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
# THIS SOFTWARE.
#
# SPDX-License-Identifier: 0BSD

import argparse
import os
import sys
import logging

# This script so far generates config.mk.
# The only value it produces is prefix,
# which is either taken as the first argument
# to this script, or as --prefix=, or read
# from the environment variable PREFIX.
#
# TODO: Also respect DESTDIR ($PREFIX/$DESTDIR/rest).


def _read_prefix():
    logging.basicConfig(level=logging.DEBUG)
    logger = logging.getLogger(__name__)

    if 'PREFIX' in os.environ:
        logger.debug('PREFIX from environment')
        myprefix = os.environ.get('PREFIX')
        if myprefix is not None and os.path.isdir(myprefix) is True:
            logger.debug('PREFIX from environment: %s', myprefix)
            return myprefix

    else:
        logger.debug('PREFIX from argv')
        parser = argparse.ArgumentParser()
        parser.add_argument("-p",
                            "--prefix",
                            type=str,
                            required=True,
                            help='Directory prefix for installation')
        logger.debug('parser.parse_args step')
        args = parser.parse_args()
        logger.debug('%s', args)
        myprefix = args.prefix
        # if args.prefix is not None and os.path.isdir(myprefix) is True:
        if args.prefix and os.path.isdir(myprefix) is True:
            return myprefix

def main():
    myprefix = str(_read_prefix())
    f = open('config.mk', 'w+')
    f.write('# this file is autogenerated by ./configure\n')
    f.write('prefix=' + myprefix + '\n')
    f.close()


main()