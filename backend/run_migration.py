#!/usr/bin/env python3
"""
Database migration runner script
Applies migrations to add nutritional analysis columns
"""

import sqlite3
import sys
from pathlib import Path
import os

def run_migration(db_path, migration_file):
    """Run a specific migration file"""
    try:
        # Read migration SQL
        with open(migration_file, 'r') as f:
            migration_sql = f.read()
        
        # Split into individual statements (ignore comments and empty lines)
        statements = []
        for line in migration_sql.split('\n'):
            line = line.strip()
            if line and not line.startswith('--') and not line.startswith('COMMENT'):
                statements.append(line)
        
        # Combine statements that don't end with semicolon
        final_statements = []
        current_statement = ""
        
        for statement in statements:
            current_statement += statement + " "
            if statement.endswith(';'):
                final_statements.append(current_statement.strip())
                current_statement = ""
        
        # Connect to database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        print(f"Running migration: {migration_file}")
        
        # Execute each statement
        for i, statement in enumerate(final_statements):
            try:
                print(f"  Executing statement {i+1}: {statement[:50]}...")
                cursor.execute(statement)
                print(f"  ✓ Success")
            except sqlite3.Error as e:
                if "duplicate column name" in str(e).lower():
                    print(f"  ⚠ Column already exists, skipping: {e}")
                else:
                    print(f"  ❌ Error: {e}")
                    raise
        
        # Commit changes
        conn.commit()
        conn.close()
        
        print(f"✅ Migration completed successfully: {migration_file}")
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        return False
    
    return True

def main():
    """Main migration runner"""
    # Get database path
    backend_dir = Path(__file__).parent
    db_path = backend_dir / "food_analysis.db"
    
    # Check if database exists
    if not db_path.exists():
        print(f"❌ Database not found: {db_path}")
        print("Please ensure the backend has been run at least once to create the database")
        return
    
    # Get migration file
    migration_file = backend_dir / "migrations" / "002_add_nutrition_columns.sql"
    
    if not migration_file.exists():
        print(f"❌ Migration file not found: {migration_file}")
        return
    
    print("🔧 Starting nutrition columns migration...")
    print(f"Database: {db_path}")
    print(f"Migration: {migration_file}")
    
    # Run migration
    success = run_migration(str(db_path), str(migration_file))
    
    if success:
        print("\n✅ All migrations completed successfully!")
        print("The backend now supports nutritional analysis with calorie and macronutrient tracking")
    else:
        print("\n❌ Migration failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()